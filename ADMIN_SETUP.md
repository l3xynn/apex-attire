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

This project is currently a demo, not a trading business. Public test checkout is prepared but stays closed until a short test window is deliberately opened. In demo mode, Paystack's test key is required, pay-on-delivery is unavailable, orders are marked as tests, and no goods are shipped. Never use a live Paystack key for this demo.

To run a public demo window, first deploy the updated `checkout` Edge Function while ordering is still disabled. Immediately before testing, set `ORDERING_TEST_MODE=true` and `ORDERING_TEST_EXPIRES_AT` to a UTC ISO timestamp about 20–30 minutes ahead in Supabase Edge Function Secrets. Set the same timestamp in `store-config.js` as `demoEndsAt`, set `orderingEnabled: true`, and publish the storefront. Only after verifying that the public site shows the demo warning, set `ORDERING_ENABLED=true`. The server rejects new orders if any of the test-mode flag, expiry, test key or ordering flag is missing. After testing, set `ORDERING_ENABLED=false` first, then restore `orderingEnabled: false` and `demoEndsAt: ""` and publish again. Do not fulfil or treat demo orders as sales.

The code is prepared but ordering is off in both `store-config.js` and the Edge Function `ORDERING_ENABLED` setting. Do not enable either one until the full test flow passes.

1. `orders.sql` has been applied to the Supabase project. It creates the private order table and customer/admin read policies. Apply `orders-fulfilment.sql` once to add admin-only fulfilment updates and mark all existing pre-launch orders as tests. Run `orders.sql` again only when setting up another project.
2. In Paystack, obtain a **test** secret key. Add it in Supabase Edge Function Secrets as `PAYSTACK_SECRET_KEY`. Never paste a secret key into site files, GitHub, or chat. Keep `ORDERING_ENABLED` unset or `false` for now.
3. Deploy `checkout` and `paystack-webhook` from this repository with the Supabase CLI, using `supabase/config.toml`. Redeploy both after changing their shared payment helper. The webhook function must have `verify_jwt = false`; it authenticates Paystack's HMAC signature instead.
4. Set the Paystack **test** webhook URL to `https://fzepfojrtalfayimnsnp.supabase.co/functions/v1/paystack-webhook`. The checkout function redirects back to the Netlify or GitHub Pages shop URL, based on the storefront origin.
5. Add confirmed state-wide delivery rates and any city/LGA overrides in the dashboard. Verify prices, sizes and sold-out products in the catalogue. Run `node scripts/sync-server-catalogue.mjs` after any direct edit to `products.js` and before deploying the Edge Function; admin dashboard overrides are read live from Supabase.
6. Set `ORDERING_ENABLED=true` in Supabase Edge Function Secrets and `orderingEnabled: true` in `store-config.js` **only in a controlled test deployment**. Test Lagos delivery with Paystack, outside-Lagos delivery with Paystack, Lagos pay-on-delivery, pickup, failed or abandoned payment, duplicate callbacks, and a changed/sold-out product. Confirm the admin orders screen and payment statuses.
7. Keep the Paystack test secret and test webhook for this demo. Do not switch to live payments unless APEX ATTIRE becomes a real trading business and completes Paystack activation.

The server recalculates products and delivery fees from its own catalogue/database, validates the signed-in user, and records an order before sending the customer to Paystack. A Paystack callback or webhook does not mark an order paid until the server verifies reference, status, NGN amount and customer email with Paystack. Pay-on-delivery is restricted to Lagos delivery; pickup can be paid at collection. Test-mode pickup, Lagos pay-on-delivery, nationwide delivery, abandoned payment and webhook delivery have passed. Ordering is currently disabled in the storefront and Supabase secret. Test orders cannot be fulfilled in the dashboard; cancelling a paid order does not automatically refund it.
