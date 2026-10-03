import "../_shared/base-products.js";
import { getAdminClient, getPaystackSecret, verifyPaystackOrder } from "../_shared/payment.ts";

type Variant = { name: string; price?: number; image?: string; soldOut?: boolean; unavailableSizes?: string[] };
type Product = {
  id: string; name: string; price: number; image?: string; colour?: string;
  sizes: string[]; colours?: Variant[]; soldOut?: boolean;
  unavailableSizes?: string[]; placeholder?: boolean;
};
type BagRow = { product_id: string; size: string; colour: string; quantity: number };
type CheckoutItem = {
  id: string; name: string; size: string; colour: string; quantity: number;
  price: number; image: string;
};

const catalogue = (globalThis as unknown as { apexCatalogue: { products: Product[] } }).apexCatalogue;
const allowedOrigins = new Set([
  "https://l3xynn-apexattire.netlify.app",
  "https://l3xynn.github.io"
]);

class CheckoutError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function getOrigin(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  throw new CheckoutError("This storefront is not allowed to check out.", 403);
}

function getCors(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin"
  };
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

async function getAuthenticatedUser(admin: ReturnType<typeof getAdminClient>, request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new CheckoutError("Sign in to continue.", 401);
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user?.email) throw new CheckoutError("Your session expired. Sign in again.", 401);
  return data.user;
}

async function priceBag(admin: ReturnType<typeof getAdminClient>, userId: string) {
  const [bagResult, productResult] = await Promise.all([
    admin.from("saved_bag_items").select("product_id, size, colour, quantity").eq("user_id", userId),
    admin.from("catalogue_products").select("id, data, archived")
  ]);
  if (bagResult.error || productResult.error) throw new CheckoutError("The catalogue is unavailable. Try again shortly.", 503);
  const bag = bagResult.data as BagRow[];
  if (!bag?.length) throw new CheckoutError("Your bag is empty.");
  const productMap = new Map(catalogue.products.map((product) => [product.id, product]));
  for (const row of productResult.data || []) {
    if (row.archived) productMap.delete(row.id);
    else if (row.data?.id === row.id) productMap.set(row.id, row.data as Product);
  }

  const items: CheckoutItem[] = [];
  let subtotal = 0;
  for (const row of bag) {
    const product = productMap.get(row.product_id);
    if (!product || product.placeholder || product.soldOut ||
        !product.sizes?.includes(row.size) || !Number.isSafeInteger(row.quantity) ||
        row.quantity < 1 || row.quantity > 10) {
      throw new CheckoutError("A bag item is unavailable. Refresh your bag before ordering.");
    }
    const variants: Variant[] = product.colours?.length ? product.colours : [{
      name: product.colour || "As pictured", image: product.image
    }];
    const variant = variants.find((choice) => choice.name === row.colour) ||
      (!row.colour && variants.length === 1 ? variants[0] : undefined);
    if (!variant || variant.soldOut || product.unavailableSizes?.includes(row.size) ||
        variant.unavailableSizes?.includes(row.size)) {
      throw new CheckoutError("A bag item is unavailable. Refresh your bag before ordering.");
    }
    const price = variant.price ?? product.price;
    if (!Number.isSafeInteger(price) || price <= 0) throw new CheckoutError("A product price is unavailable.", 503);
    subtotal += price * row.quantity;
    if (!Number.isSafeInteger(subtotal)) throw new CheckoutError("The bag total is too large.");
    items.push({ id: product.id, name: product.name, size: row.size, colour: variant.name,
      quantity: row.quantity, price, image: variant.image || product.image || "" });
  }
  return { items, subtotal };
}

async function deliveryFee(admin: ReturnType<typeof getAdminClient>, fulfilment: string, state: string, city: string) {
  if (fulfilment === "pickup") return 0;
  const { data, error } = await admin.from("delivery_rates")
    .select("city_lga, fee_naira").eq("state", state);
  if (error) throw new CheckoutError("Delivery rates are unavailable. Try again shortly.", 503);
  const rate = data?.find((item) => item.city_lga === city) || data?.find((item) => item.city_lga === "");
  if (!rate) throw new CheckoutError("We do not have a confirmed delivery fee for that location yet.");
  return rate.fee_naira as number;
}

async function startCheckout(admin: ReturnType<typeof getAdminClient>, user: { id: string; email?: string }, body: Record<string, unknown>, origin: string) {
  if (Deno.env.get("ORDERING_ENABLED") !== "true") throw new CheckoutError("Online ordering is not open yet.", 503);
  if (Deno.env.get("ORDERING_TEST_MODE") !== "true" || !getPaystackSecret().startsWith("sk_test_")) {
    throw new CheckoutError("Only test checkout is available.", 503);
  }
  const expiresAt = Date.parse(Deno.env.get("ORDERING_TEST_EXPIRES_AT") || "");
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
    throw new CheckoutError("The test checkout window has closed.", 503);
  }
  const fulfilment = cleanText(body.fulfilment, 20);
  const payment = cleanText(body.payment, 20);
  const customer = typeof body.customer === "object" && body.customer !== null
    ? body.customer as Record<string, unknown> : {};
  const name = cleanText(customer.name, 120);
  const phone = cleanText(customer.phone, 30).replace(/[\s-]/g, "");
  const state = cleanText(customer.area, 40);
  const city = cleanText(customer.city, 100);
  const address = cleanText(customer.address, 240);
  const notes = cleanText(customer.notes, 500);
  if (!/^(?:\+?234|0)[789][01]\d{8}$/.test(phone) || name.length < 2 || name.length > 120 || notes.length > 500) {
    throw new CheckoutError("Check your name, phone number and order notes.");
  }
  if (!["delivery", "pickup"].includes(fulfilment) || !["paystack", "cod"].includes(payment)) {
    throw new CheckoutError("Choose a valid fulfilment and payment method.");
  }
  if (payment === "cod") throw new CheckoutError("Pay on delivery is unavailable during the demo.");
  if (fulfilment === "delivery" && (!state || city.length < 2 || city.length > 100 || address.length < 6 || address.length > 240)) {
    throw new CheckoutError("Enter a complete delivery location and address.");
  }
  if (payment === "cod" && fulfilment === "delivery" && state !== "Lagos") {
    throw new CheckoutError("Pay on delivery is available only within Lagos. Choose Paystack instead.");
  }

  const { items, subtotal } = await priceBag(admin, user.id);
  const fee = await deliveryFee(admin, fulfilment, state, city.toLowerCase().replace(/\s+/g, " "));
  const total = subtotal + fee;
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(total * 100)) throw new CheckoutError("The total is too large.");
  const reference = `APX-${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`;
  const order = {
    order_number: reference, user_id: user.id, customer_name: name, customer_email: user.email,
    customer_phone: phone, delivery_state: fulfilment === "delivery" ? state : null,
    delivery_city: fulfilment === "delivery" ? city : null,
    delivery_address: fulfilment === "delivery" ? address : null,
    customer_notes: notes, fulfilment, payment_method: payment,
    payment_status: payment === "paystack" ? "awaiting_payment" : "pay_on_delivery",
    is_test: getPaystackSecret().startsWith("sk_test_"),
    subtotal_naira: subtotal, delivery_fee_naira: fee, total_naira: total, items,
    paystack_reference: payment === "paystack" ? reference : null
  };
  const { data: saved, error } = await admin.from("store_orders").insert(order).select("id, order_number").single();
  if (error) throw new CheckoutError("Could not save the order. Please try again.", 503);
  if (payment === "cod") return { status: "placed", order_number: saved.order_number };

  try {
    const callbackUrl = origin === "https://l3xynn.github.io"
      ? `${origin}/apex-attire/shop.html` : `${origin}/shop.html`;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${getPaystackSecret()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, amount: total * 100, currency: "NGN",
        reference, callback_url: callbackUrl })
    });
    const result = await response.json();
    if (!response.ok || !result.status || !result.data?.authorization_url) {
      throw new Error("Paystack could not start the payment.");
    }
    return { status: "payment_required", order_number: saved.order_number,
      authorization_url: result.data.authorization_url };
  } catch (error) {
    await admin.from("store_orders").update({ payment_status: "payment_failed" }).eq("id", saved.id);
    throw new CheckoutError(error instanceof Error ? error.message : "Payment could not start.", 503);
  }
}

Deno.serve(async (request) => {
  let origin = "";
  try {
    origin = getOrigin(request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: getCors(origin) });
    if (request.method !== "POST") throw new CheckoutError("Method not allowed.", 405);
    const admin = getAdminClient();
    const user = await getAuthenticatedUser(admin, request);
    const body = await request.json() as Record<string, unknown>;
    let result;
    if (body.action === "start") {
      result = await startCheckout(admin, user, body, origin);
    } else if (body.action === "verify") {
      const reference = cleanText(body.reference, 80);
      const { data: order, error } = await admin.from("store_orders")
        .select("order_number, user_id, payment_status, paystack_reference")
        .eq("paystack_reference", reference).eq("user_id", user.id).maybeSingle();
      if (error || !order) throw new CheckoutError("Order not found.", 404);
      if (order.payment_status === "awaiting_payment") await verifyPaystackOrder(admin, reference);
      const { data: updated, error: readError } = await admin.from("store_orders")
        .select("order_number, customer_name, customer_phone, delivery_state, delivery_city, fulfilment, payment_method, payment_status, subtotal_naira, delivery_fee_naira, total_naira, items, paystack_reference")
        .eq("paystack_reference", reference).eq("user_id", user.id).single();
      if (readError) throw new CheckoutError("Could not read your order.", 503);
      result = { status: updated.payment_status, order: updated };
    } else if (body.action === "order") {
      const number = cleanText(body.orderNumber, 80);
      const { data: order, error } = await admin.from("store_orders")
        .select("order_number, customer_name, customer_phone, delivery_state, delivery_city, fulfilment, payment_method, payment_status, subtotal_naira, delivery_fee_naira, total_naira, items, paystack_reference")
        .eq("order_number", number).eq("user_id", user.id).maybeSingle();
      if (error || !order) throw new CheckoutError("Order not found.", 404);
      result = { status: order.payment_status, order };
    } else {
      throw new CheckoutError("Unknown checkout action.");
    }
    return Response.json(result, { headers: getCors(origin) });
  } catch (error) {
    const status = error instanceof CheckoutError ? error.status : 500;
    if (status === 500) console.error("Checkout failed", error);
    return Response.json({ error: error instanceof CheckoutError ? error.message : "Checkout is temporarily unavailable." },
      { status, headers: origin ? getCors(origin) : {} });
  }
});
