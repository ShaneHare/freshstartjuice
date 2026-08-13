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
  `wellness` / `family` / `reset3`). Tap-to-select flavor chips, each
  with a photo, across 7 flavors (6 juices + Island Citrus Tea) for
  Single Bottle/Wellness/Family; the 3-Day Reset shows a locked curated
  assortment (3 of each of the original 6 juice blends only) instead,
  since it's not meant to be mixed. Single Bottle has no fixed size —
  customers pick any quantity at $9/bottle, mix and match. Pickup or
  local delivery only — no shipping anywhere in Phase 1. Delivery
  requires 6+ bottles (works for Single Bottle too once quantity hits
  6). A checkbox order bump right above the payment button lets anyone
  add a bonus bottle of Island Citrus Tea for a flat $7, with the
  summary total updating live — available on all 4 products. Saves the
  order via `create-order` (including whether the bump was selected),
  then calls `create-checkout-session` to build a real Stripe Checkout
  Session combining the base product and the optional bump into one
  charge (a static Payment Link can't include a second, page-decided
  line item, and separately can't be pre-filled with a quantity via URL
  for Single Bottle — confirmed by testing). If that call fails, falls
  back to the product's static Stripe Payment Link so the customer can
  still pay; a bump selected in that fallback case won't be charged
  there, but is still recorded on the saved order for Shane to check.
- **thank-you.html** — post-purchase page. "Love FreshStart?" Juice Plan
  (Subscribe & Save 5%) pitch, collapsed behind "Learn About Juice Plans."
  Requires Shane to set each Stripe Payment Link's after-payment redirect
  to this URL (Stripe dashboard setting, not something Claude can do).
- **subscribe.html** — old subscribe entry point, now just redirects to
  Shop.html (Subscribe & Save moved to post-purchase, Phase 2).
- **netlify/functions/create-order.js** — saves a new order (status
  "Pending Payment") to Netlify Blobs when checkout.html submits,
  including `bumpIslandTea` (true/false) if the order bump was selected.
- **netlify/functions/create-checkout-session.js** — used by all 4
  products now. Creates a real Stripe Checkout Session server-side with
  the base product's real Stripe Price as one line item (quantity =
  customer's chosen count for Single Bottle, always 1 for the 3 fixed
  packs since their Price already covers the whole pack) plus, when
  selected, a second $7 "Island Citrus Tea — Bonus Bottle" line item
  using inline `price_data` (not a stored Price, since it's a promo
  add-on). Price IDs: Single `price_1TlfyvLObZrlzLTVufjhhFdQ`, Wellness
  `price_1Tr28JLObZrlzLTVn9Sk23Wt`, Family `price_1Tr2NpLObZrlzLTVlGwPoWEA`,
  3-Day Reset `price_1Tr2cHLObZrlzLTVOuiHIL44`. Reuses the same
  `STRIPE_SECRET_KEY` already set in Netlify — no new env var needed.
- **netlify/functions/stripe-webhook.js** — Stripe calls this on
  `checkout.session.completed`; verifies the signature, flips the
  matching order to "Paid," emails Shane the completed order (including
  whether the Island Citrus Tea bump was added), and writes the
  flavors/fulfillment/bump/notes onto the Stripe PaymentIntent itself
  (description + metadata) so they're visible directly in the Stripe
  dashboard, not just in the email — Stripe only ever showed price and
  payer by default.
- **shop.js** — retired, no page currently loads it. Left in the repo,
  not deleted, in case any of its logic is useful again.
- **Label History.html** — timeline of every label/photo era.
- **index.html** — landing page (Story, Flavors, Batch Notes, Reviews).

## Current catalog (Phase 1 — 4 products)
- Single Bottle — $9/bottle, any quantity, mix & match, visually secondary
  card (not styled as "recommended"). Pickup only under 6 bottles,
  delivery unlocks at 6+.
- Wellness Pack — 6 bottles, $49 ($8.17/btl) — mix & match
- Family Pack — 12 bottles, $96 ($8.00/btl) — mix & match
- 3-Day Wellness Reset — 18 bottles, $145 ($8.06/btl) — curated, 3 of each
  of the 6 original juice blends (Island Citrus Tea not included, to keep
  the 3-per-blend math even), substitutions via Special Instructions
- Island Citrus Tea — 7th flavor, our first botanical tea (caffeine-free,
  brewed from pineapple/orange/lime peel). Selectable on Single Bottle,
  Wellness, and Family; not part of the 3-Day Reset assortment. Also
  offered as a $7 checkout order bump (1 bonus bottle) on all 4
  products, to promote the newest flavor.

Not on the public Shop page right now (kept in Stripe/code, not deleted):
the 4-Pack Intro concept, and the premium Wellness Reset Kits ($72 / $179
with guide + checklist + card).

## Order flow (Phase 2, new)
1. Customer fills out checkout.html — optionally checking the "Add a
   bonus bottle of Island Citrus Tea" order bump for $7 — and submits.
2. `create-order` saves the full order (including `bumpIslandTea`) to
   Netlify Blobs, status "Pending Payment," returns an `orderId`.
3. Browser calls `create-checkout-session` with the product, quantity
   (Single Bottle only), bump flag, and orderId, and redirects to the
   Checkout Session URL it returns — one Stripe charge covering the
   base product plus the bump if selected. If that call fails, it falls
   back to the product's static Payment Link with
   `?client_reference_id=<orderId>` appended instead (the bump can't
   ride along on a static link in that fallback case).
4. Stripe confirms payment → fires `checkout.session.completed` →
   `stripe-webhook` verifies the signature, looks up the order by that
   same ID, flips it to "Paid," records the Stripe session ID and amount,
   and emails Shane the completed order via FormSubmit.
5. Customer-facing payment confirmation should come from Stripe's own
   built-in receipt email (Settings → Emails → "Successful payments"),
   not FormSubmit — FormSubmit only reliably delivers to pre-activated
   addresses, i.e. Shane's own inbox, not arbitrary customer emails.

Setup steps only Shane can complete: see `STRIPE-WEBHOOK-SETUP.md`.

If `create-order` is ever unreachable, checkout.html now proceeds
straight to Stripe without opening an email popup (the earlier `mailto:`
fallback was removed per Shane's request, since it appeared unexpectedly
during testing). This means order details — including Special
Instructions — won't reach Shane in that rare case. A better fallback is
an open item below.

## Fulfillment (Phase 1)
Pickup (free) and Local Delivery (San Leandro $7, Oakland/Alameda/San
Lorenzo/Castro Valley $10, Hayward/Union City $20) — no shipping anywhere.
Delivery requires 6+ bottles; Single Bottle can reach that threshold too
since it now allows any quantity.

## OPEN — next steps
- **Verify the order bump live.** Regression-tested with mock Stripe/
  Blobs (all 4 products, with and without the bump, plus the
  create-checkout-session failure fallback) but not yet run through an
  actual live Stripe test payment. Worth placing one real test order
  with the bump checked to confirm the $7 line item shows up correctly
  in Stripe and the webhook writes it onto the PaymentIntent.
- **Confirm flavors now show up in Stripe.** Shane confirmed the
  multi-quantity Single Bottle checkout charges correctly, but flagged
  that Stripe's dashboard only ever showed price and payer — no flavor
  info. Fixed by having `stripe-webhook` write flavors/fulfillment/notes
  onto the PaymentIntent (description shows in the Payments list,
  full detail in Metadata on the payment page) — applies to all 4
  products. This only takes effect for orders placed *after* this
  deploys; past payments won't be updated retroactively. Worth checking
  the next live order shows flavors directly in Stripe.
- Single Bottle's static Payment Link (`buy.stripe.com/9B6bJ2co...`) now
  also has "Allow customers to adjust quantity" turned on in Stripe, as
  a manual-fallback safety net (used if `create-checkout-session` ever
  fails) — not the primary path anymore, but worth knowing it's there.
- Build a better fallback for capturing order details (flavors,
  fulfillment, Special Instructions) when `create-order` can't be
  reached — the `mailto:` popup was removed for now per Shane's request,
  so there's currently no fallback at all in that edge case.
- Finish validating the live order flow end to end (Shop → checkout →
  Stripe → webhook → Blobs "Paid" → owner email) — a real order was in
  progress when the Single Bottle work started; resume or redo it before
  considering the webhook setup fully proven.
- Decide whether FormSubmit-for-owner-notification is good enough
  long-term or worth swapping for a real transactional email API.
- Phase 2: hook the Operations App into paid orders in Netlify Blobs
  for recipe scaling, shopping lists, and production workflows.
- Revisit the 4-Pack and the premium Kits as marketing/promo-only offers
  (separate Payment Links, not on the main Shop page).
- The homepage's Product schema (JSON-LD) only lists 2 of the 7 flavors
  (Roots Refresh, Ginger Boost) — pre-existing gap, not touched yet.
