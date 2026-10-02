import { getAdminClient, getPaystackSecret, verifyPaystackOrder } from "../_shared/payment.ts";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const rawBody = await request.arrayBuffer();
    const signature = request.headers.get("x-paystack-signature") || "";
    if (!/^[0-9a-f]{128}$/i.test(signature)) return new Response("Unauthorized", { status: 401 });
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(getPaystackSecret()),
      { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, rawBody));
    const expected = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
    let difference = 0;
    for (let index = 0; index < expected.length; index++) {
      difference |= expected.charCodeAt(index) ^ signature.toLowerCase().charCodeAt(index);
    }
    if (difference !== 0) return new Response("Unauthorized", { status: 401 });

    const event = JSON.parse(new TextDecoder().decode(rawBody));
    if (event.event === "charge.success" && typeof event.data?.reference === "string") {
      await verifyPaystackOrder(getAdminClient(), event.data.reference);
    }
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Paystack webhook failed", error);
    return new Response("Temporary error", { status: 500 });
  }
});
