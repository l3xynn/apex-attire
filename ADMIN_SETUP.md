# APEX ATTIRE admin dashboard

The dashboard is at `admin.html`. Sign in through `account.html` with the admin account; its dashboard link appears only for an admin. Access is enforced in Supabase Row Level Security (RLS), not by hiding the link.

On desktop, account links open `account.html` in a centred modal over the blurred storefront. On mobile, the account page opens normally. New customers enter their name, phone and delivery address during signup. Supabase Auth holds those details in signup metadata until the email is confirmed; on confirmation or the next sign-in, the site saves them to `customer_profiles` and `delivery_addresses` before returning to `shop.html`. Existing signed-in customers see a compact account hub rather than their personal details form. If setup fails, they can retry from that hub.

The signed-in account hub displays the customer's name, email, phone and saved addresses. Customers can edit their name and phone and add, edit or remove addresses. The address-update policy was applied to the live Supabase project; `account-address-update.sql` records the migration for other environments. The dashboard switch is shown only after the signed-in user passes the `admin_users` membership check; RLS remains the actual protection for admin data.

Password recovery sends a Supabase reset email back to `account.html`. Ensure every live `account.html` URL used for signup and recovery is listed in Supabase Authentication → URL Configuration, and configure production SMTP before relying on email delivery. Test the reset link on both hosting domains. Product details now include category-specific measuring advice where sizing applies; this is not a numeric size chart, so add verified measurements before claiming exact fit guidance.

The existing catalogue in `products.js` remains the starting catalogue. Product and category edits are saved as Supabase overrides, so existing product IDs and saved bags stay intact. Removing a product archives its override and hides it from the storefront; the dashboard can restore it. New categories appear in shop filters. Homepage category image tiles are curated in `index.html` and do not change automatically.

Product images are stored in the public `product-images` bucket. Only the admin account can upload or remove files. The first photo of each colour is used as its card image; additional photos appear in the product details. Use JPG, PNG, WebP or AVIF images under 8 MB each.

`catalogue-admin.sql` contains the database schema and policies. It has been applied to the Supabase project. Keep it with the project as the setup record. `admin-access.sql` documents the admin role table; the admin grant itself was applied separately and is not stored in source control.

Public page-view recording is paused because anonymous inserts could be abused. Run `security-hardening.sql` in the Supabase SQL Editor to revoke the old insert access; the dashboard will show historical counts until protected analytics is added. The storefront now hides products if it cannot verify the live catalogue, rather than showing potentially removed or sold-out static items. Ordering remains disabled until the Paystack flow is deployed and tested.

Before relying on a deployment, test as both the admin and a normal customer: add a product, upload more than one photo for a colour, edit price and sizes, mark sold out, remove and restore it, and confirm customers cannot reach the dashboard or write catalogue data.

## Delivery-rate editor

`delivery-rates.sql` has been applied to the Supabase project. The Rates section lets the admin set a state-wide fee and optional city/LGA overrides. Leave City / LGA blank for the state-wide fee; spell city/LGA names consistently with customer checkout entries. Only the admin can change rates. The checkout preview and server both read published rates. Do not put a Paystack secret key in this repository or the browser.

## Paystack checkout

This project is a client preview, not a trading business. Checkout uses Paystack's test key only; pay-on-delivery is unavailable, orders are marked as tests, and no goods are shipped. The storefront uses normal shopping language but clearly identifies the test payment at checkout. Never use a live Paystack key for this preview.

The current preview expires on 6 October 2026 at 03:38:33 UTC (04:38:33 Lagos time). First set `ORDERING_ENABLED=false`, then set `ORDERING_TEST_EXPIRES_AT=2026-10-06T03:38:33.000Z` in Supabase Edge Function Secrets to match `demoEndsAt` in `store-config.js`. Keep `ORDERING_TEST_MODE=true` and the Paystack test secret. Publish the storefront before setting `ORDERING_ENABLED=true`. The server rejects new orders if any of the test-mode flag, expiry, test key or ordering flag is missing. After the presentation, set `ORDERING_ENABLED=false` first, then restore `orderingEnabled: false` and `demoEndsAt: ""` and publish again. Do not fulfil or treat preview orders as sales.

The storefront preview is configured, but the previous server-side expiry has passed. It remains closed until the matching new expiry is saved and `ORDERING_ENABLED=true` is confirmed. Do not enable it without the Paystack test key and `ORDERING_TEST_MODE=true`.

1. `orders.sql` has been applied to the Supabase project. It creates the private order table and customer/admin read policies. Apply `orders-fulfilment.sql` once to add admin-only fulfilment updates and mark all existing pre-launch orders as tests. Run `orders.sql` again only when setting up another project.
2. In Paystack, obtain a **test** secret key. Add it in Supabase Edge Function Secrets as `PAYSTACK_SECRET_KEY`. Never paste a secret key into site files, GitHub, or chat. Keep `ORDERING_ENABLED` unset or `false` for now.
3. Deploy `checkout` and `paystack-webhook` from this repository with the Supabase CLI, using `supabase/config.toml`. Redeploy both after changing their shared payment helper. The webhook function must have `verify_jwt = false`; it authenticates Paystack's HMAC signature instead.
4. Set the Paystack **test** webhook URL to `https://fzepfojrtalfayimnsnp.supabase.co/functions/v1/paystack-webhook`. The checkout function redirects back to the Netlify or GitHub Pages shop URL, based on the storefront origin.
5. Add confirmed state-wide delivery rates and any city/LGA overrides in the dashboard. Verify prices, sizes and sold-out products in the catalogue. Run `node scripts/sync-server-catalogue.mjs` after any direct edit to `products.js` and before deploying the Edge Function; admin dashboard overrides are read live from Supabase.
6. Set `ORDERING_ENABLED=true` in Supabase Edge Function Secrets only for the time-limited preview. Test Lagos delivery with Paystack, outside-Lagos delivery with Paystack, pickup, failed or abandoned payment, duplicate callbacks, and a changed/sold-out product. Pay-on-delivery remains unavailable. Confirm the admin orders screen and payment statuses.
7. Keep the Paystack test secret and test webhook for this preview. Do not switch to live payments unless APEX ATTIRE becomes a real trading business and completes Paystack activation.

The server recalculates products and delivery fees from its own catalogue/database, validates the signed-in user, and records an order before sending the customer to Paystack. A Paystack callback or webhook does not mark an order paid until the server verifies reference, status, NGN amount and customer email with Paystack. Test-mode pickup, nationwide delivery, abandoned payment and webhook delivery have passed. Test orders cannot be fulfilled in the dashboard; cancelling a paid order does not automatically refund it.
