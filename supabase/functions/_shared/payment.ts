import { createClient } from "npm:@supabase/supabase-js@2";

export function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Supabase server credentials are unavailable.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export function getPaystackSecret() {
  const key = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!key || !/^sk_(test|live)_/.test(key)) throw new Error("Paystack is not configured.");
  return key;
}

export async function verifyPaystackOrder(admin: ReturnType<typeof getAdminClient>, reference: string) {
  const { data: order, error } = await admin.from("store_orders")
    .select("id, order_number, user_id, customer_email, total_naira, payment_status, paystack_reference")
    .eq("paystack_reference", reference).maybeSingle();
  if (error) throw error;
  if (!order) return null;
  if (order.payment_status === "paid") return order;
  if (order.payment_status !== "awaiting_payment") return null;

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getPaystackSecret()}` }
  });
  if (!response.ok) throw new Error("Payment verification is temporarily unavailable.");
  const result = await response.json();
  const payment = result.data;
  if (!result.status) throw new Error("Paystack verification failed.");
  if (["failed", "abandoned"].includes(payment?.status)) {
    const { error: failureError } = await admin.from("store_orders")
      .update({ payment_status: "payment_failed" })
      .eq("id", order.id).eq("payment_status", "awaiting_payment");
    if (failureError) throw failureError;
    return null;
  }
  if (payment?.status !== "success") return null;
  if (payment.reference !== reference || payment.currency !== "NGN" ||
      payment.amount !== order.total_naira * 100 ||
      String(payment.customer?.email || "").toLowerCase() !== order.customer_email.toLowerCase()) {
    throw new Error("Payment details do not match the order.");
  }

  const { error: updateError } = await admin.from("store_orders")
    .update({ payment_status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id).eq("payment_status", "awaiting_payment");
  if (updateError) throw updateError;
  return { ...order, payment_status: "paid" };
}
