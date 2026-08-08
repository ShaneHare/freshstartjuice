# Fresh Start — Project Status & Next Steps

_Last updated: August 8, 2026_

## What we're building
Phase 1: the simplest possible Shop page — four fixed products, guided
flavor selection, straight to Stripe. Phase 2 (in progress): an order
system behind it, so every order is saved the moment a customer submits
the checkout form, then confirmed as "Paid" by a Stripe webhook.

## Files
- **Shop.html** — hero + three full product cards (Wellness Pack, Family
  Pack, 3-Day Wellness Reset) + a smaller, visually secondary Single
  Bottle row + concise FAQ + footer. No box builder, no cart, no
  Subscribe & Save on this page.
- **checkout.html** — one guided page per product (`?product=single` /
  `wellness` / `family` / `reset3`). Tap-to-select flavor chips for
  Single Bottle/Wellness/Family (capped at 1 for Single Bottle); the
  3-Day Reset shows a locked curated assortment (3 of each blend)
  instead, since it's not meant to be mixed. Pickup or local delivery
  only — no shipping anywhere in Phase 1. Delivery requires a 6-bottle
  minimum, so Single Bottle is pickup-only. Saves the order via
  `create-order`, then redirects to Stripe with `client_reference_id`
  attached.
- **thank-you.html** — post-purchase page. "Love FreshStart?" Juice Plan
  (Subscribe & Save 5%) pitch, collapsed behind "Learn About Juice Plans."
  Requires Shane to set each Stripe Payment Link's after-payment redirect
  to this URL (Stripe dashboard setting, not something Claude can do).
- **subscribe.html** — old subscribe entry point, now just redirects to
  Shop.html (Subscribe & Save moved to post-purchase, Phase 2).
- **netlify/functions/create-order.js** — saves a new order (status
  "Pending Payment") to Netlify Blobs when checkout.html submits.
- **netlify/functions/stripe-webhook.js** — Stripe calls this on
  `checkout.session.completed`; verifies the signature, flips the
  matching order to "Paid," emails Shane the completed order.
- **shop.js** — retired, no page currently loads it. Left in the repo,
  not deleted, in case any of its logic is useful again.
- **Label History.html** — timeline of every label/photo era.
- **index.html** — landing page (Story, Flavors, Batch Notes, Reviews).

## Current catalog (Phase 1 — 4 products)
- Single Bottle — 1 bottle, $9 — choose 1 blend, pickup only, visually
  secondary card (not styled as "recommended")
- Wellness Pack — 6 bottles, $49 ($8.17/btl) — mix & match
- Family Pack — 12 bottles, $96 ($8.00/btl) — mix & match
- 3-Day Wellness Reset — 18 bottles, $145 ($8.06/btl) — curated, 3 of each
  of the 6 blends, substitutions via Special Instructions

Not on the public Shop page right now (kept in Stripe/code, not deleted):
the 4-Pack Intro concept, and the premium Wellness Reset Kits ($72 / $179
with guide + checklist + card).

## Order flow (Phase 2, new)
1. Customer fills out checkout.html and submits.
2. `create-order` saves the full order to Netlify Blobs, status
   "Pending Payment," returns an `orderId`.
3. Browser redirects to the product's Stripe Payment Link with
   `?client_reference_id=<orderId>` appended.
4. Stripe confirms payment → fires `checkout.session.completed` →
   `stripe-webhook` verifies the signature, looks up the order by that
   same ID, flips it to "Paid," records the Stripe session ID and amount,
   and emails Shane the completed order via FormSubmit.
5. Customer-facing payment confirmation should come from Stripe's own
   built-in receipt email (Settings → Emails → "Successful payments"),
   not FormSubmit — FormSubmit only reliably delivers to pre-activated
   addresses, i.e. Shane's own inbox, not arbitrary customer emails.

Setup steps only Shane can complete: see `STRIPE-WEBHOOK-SETUP.md`.

If `create-order` is ever unreachable, checkout.html falls back to
opening a pre-filled `mailto:` to Shane so the order still isn't lost —
the customer still completes checkout on Stripe either way.

## Fulfillment (Phase 1)
Pickup (free) and Local Delivery (San Leandro $7, Oakland/Alameda/San
Lorenzo/Castro Valley $10, Hayward/Union City $20) — no shipping anywhere.
Delivery requires a 6-bottle minimum, so Single Bottle is pickup-only;
Wellness, Family, and 3-Day Reset can use either.

## OPEN — next steps
- Finish validating the live order flow end to end (Shop → checkout →
  Stripe → webhook → Blobs "Paid" → owner email) — a real order was in
  progress when this Single Bottle update came in; resume or redo it
  before considering the webhook setup fully proven.
- Decide whether FormSubmit-for-owner-notification is good enough
  long-term or worth swapping for a real transactional email API.
- Phase 2: hook the Operations App into paid orders in Netlify Blobs
  for recipe scaling, shopping lists, and production workflows.
- Revisit the 4-Pack and the premium Kits as marketing/promo-only offers
  (separate Payment Links, not on the main Shop page).
