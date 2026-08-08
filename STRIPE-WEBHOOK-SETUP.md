# Stripe webhook setup — one-time steps for Shane

The code is done and lives in `netlify/functions/`. It won't do anything
until these steps are complete, since they involve your Stripe and
Netlify accounts, which Claude has no access to.

## 1. Get your Stripe secret key
Stripe Dashboard → Developers → API keys → copy the **Secret key**
(`sk_live_...` for real money, or `sk_test_...` while testing).

## 2. Add environment variables in Netlify
Netlify Dashboard → your site → Site configuration → Environment variables
→ Add variable:
- `STRIPE_SECRET_KEY` = the key from step 1
- `STRIPE_WEBHOOK_SECRET` = leave a placeholder for now, you'll get the
  real value in step 3 and come back to update it

Redeploy the site after adding these (Netlify usually prompts you to).

## 3. Register the webhook endpoint in Stripe
Stripe Dashboard → Developers → Webhooks → Add endpoint:
- Endpoint URL: `https://freshstartjuiceproject.com/.netlify/functions/stripe-webhook`
- Events to send: `checkout.session.completed`

After you create it, Stripe shows a **Signing secret** (starts with
`whsec_`). Copy that into Netlify as `STRIPE_WEBHOOK_SECRET` (replacing
the placeholder from step 2), then redeploy again.

## 4. Turn on Stripe's own payment receipt (recommended)
Stripe Dashboard → Settings → Emails → turn on "Successful payments."
This is what actually confirms the order to the *customer* — the
webhook function only emails you, since FormSubmit can't reliably send
to arbitrary customer addresses without each one manually activating.

## 5. Confirm Netlify Blobs is available
It's included on all Netlify plans (including free), so this should
need nothing from you — just flagging it in case your account is on an
older/custom plan.

## 6. Test it
Buy one real (or Stripe test-mode) order through the site:
1. Complete checkout.html for any product.
2. Complete payment on the Stripe page you land on.
3. Check your email for the "[Freshstart Juices] PAID — ..." notification.
4. In Netlify Dashboard → your site → Blobs, look for a key starting
   with `ord_` and confirm its `status` is `"Paid"`.

If step 3 or 4 doesn't happen, the most common cause is the webhook
secret not matching — double check step 3 was saved correctly and the
site redeployed after.

## Testing locally, before pushing anything

You can prove the whole order-saving + webhook flow works on your own
machine, with nothing pushed to GitHub and no real charge made.

1. Install the two CLIs (one-time):
   ```
   npm install -g netlify-cli
   brew install stripe/stripe-cli/stripe
   ```
2. From the repo folder, install dependencies and link to the real site:
   ```
   cd ~/Documents/GitHub/freshstartjuice
   npm install
   netlify login
   netlify link
   ```
   (`netlify link` will ask you to pick the site -- choose `freshstartjuice`.)
3. Copy `.env.example` to `.env` and fill in `STRIPE_SECRET_KEY` (same value
   you put in Netlify). Leave `STRIPE_WEBHOOK_SECRET` blank for a moment.
4. In a second terminal tab, log in to Stripe CLI and start forwarding:
   ```
   stripe login
   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
   ```
   It prints a signing secret like `whsec_...` -- that's a temporary secret
   for this session only, different from the one in Netlify. Paste it into
   `.env` as `STRIPE_WEBHOOK_SECRET`.
5. Back in the first terminal:
   ```
   netlify dev
   ```
   This serves the site locally (usually `http://localhost:8888`) with the
   functions live.
6. Open `http://localhost:8888/Shop.html` in your browser, click into any
   product, fill out checkout, and submit. **Stop before clicking pay on
   the Stripe page that opens** -- that's a real live Payment Link.
7. Confirm the order saved: `netlify blobs:list orders` (or check the
   Blobs tab in the Netlify dashboard) should show a new `ord_...` entry
   with `"status": "Pending Payment"`.
8. In the second terminal (where `stripe listen` is running), simulate the
   payment completing for that exact order:
   ```
   stripe trigger checkout.session.completed --override checkout_session:client_reference_id=ord_XXXXXXXX
   ```
   Replace `ord_XXXXXXXX` with the real order ID from step 7. (Flag name
   may differ slightly by CLI version -- run
   `stripe trigger checkout.session.completed --help` if it's rejected.)
9. Check three things: the terminal running `netlify dev` shows the
   webhook function returned `200`, the same Blobs entry now shows
   `"status": "Paid"`, and you received the "[Freshstart Juices] PAID --"
   email.

If all three happen, the whole flow is proven end to end without spending
a dollar or touching GitHub.

## What if something breaks?
If `create-order` can't be reached when a customer checks out, checkout.html
falls back to opening a pre-filled email to you so the order isn't lost —
the customer can still complete their Stripe payment either way. Paid
orders that somehow never got a matching saved record (e.g. `create-order`
failed but the customer still paid) won't appear in Blobs — check your
email fallback and Stripe's own dashboard for those.
