import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://l3xynn-apexattire.netlify.app",
  "https://l3xynn.github.io"
]);

function isAllowedOrigin(origin: string) {
  return allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin"
  };
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
  const headers = corsHeaders(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return new Response(null, { status: 405, headers });

  try {
    const rawBody = await request.text();
    if (rawBody.length > 64) return new Response(null, { status: 400, headers });
    const body = JSON.parse(rawBody);
    if (body.path !== "home" && body.path !== "shop") {
      return new Response(null, { status: 400, headers });
    }
    if (/bot|crawler|spider|preview/i.test(request.headers.get("user-agent") || "")) {
      return new Response(null, { status: 204, headers });
    }

    const ipAddress = request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    if (!ipAddress || ipAddress.length > 64) return new Response(null, { status: 204, headers });

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) throw new Error("Analytics credentials are unavailable.");
    const signingKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(serviceKey),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const identity = `${ipAddress}:${new Date().toISOString().slice(0, 10)}`;
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", signingKey,
      new TextEncoder().encode(identity)));
    const visitorHash = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { error } = await admin.from("store_page_views").insert({
      path: body.path,
      visitor_hash: visitorHash,
      view_bucket: Math.floor(Date.now() / 30_000)
    });
    if (error && error.code !== "23505") throw error;
    return new Response(null, { status: 204, headers });
  } catch (error) {
    console.error("Page view recording failed", error);
    return new Response(null, { status: 503, headers });
  }
});
