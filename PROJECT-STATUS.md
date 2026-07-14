# Fresh Start — Project Status & Next Steps

_Last updated: July 7, 2026_

## What we're building
Redesigning the Fresh Start commerce experience on the Suja / Pressed
product-page model: multipack-first, subscribe-vs-one-time, guided reset
programs, goal bundles, premium wellness kits, three fulfillment methods,
an on-page cart, and a label-history page.

## Files
- **Shop.html** — the build-your-pack product page (configurator, goal bundles,
  reset kit breakdown, premium wellness kits, cart, FAQ).
- **shop.js** — single source of truth: FLAVORS, PACKS, GOALS, KITS,
  fulfillment, prices, Stripe links. Edit copy/prices/links HERE.
- **Label History.html** — timeline of every label/photo era (8 chapters +
  click-to-enlarge lightbox).
- **Citrus Glow Poster.html** — standalone illustrated poster (vector; there is
  now also a photoreal Citrus Glow poster used on Shop).
- **index.html** — landing page; now links to Shop + Label History.

## Confirmed catalog (6 flavors) — all have photoreal posters
1. Roots Refresh — Beets · Watermelon · Ginger · Mint · Lime
2. Melon Refresh — Watermelon · Lime · Ginger · Mint
3. Ginger Boost — Pineapple · Ginger · Cucumber · Orange · Lemon · Vanilla · Star Anise
4. Roots+ — Beets · Cucumber · Carrot · Apple · Ginger · Lime · Turmeric · Mint
5. Citrus Glow — Orange · Lemon · Carrot · Turmeric
6. Pure Celery — 100% Celery

## Packs (live)
- Single Bottle — $9 ($9.00/btl)
- Wellness Pack — 6 btl — $49 ($8.17/btl) [default / most popular; = the "1-Day"]
- Family Pack — 12 btl — $96 ($8.00/btl)
- 3-Day Reset — 18 btl — $145 ($8.06/btl) [guided]
- ~~5-Day Reset — 30 btl — $235~~ **REMOVED / ON HOLD** (bring back later)
- (Mix & Match 4-Pack removed earlier)

## Goal bundles (live) — "Shop by Goal" section
Each "Build this pack" fills a 6-bottle Wellness Pack, 2 of each blend.
- Detox: Roots+ · Pure Celery · Citrus Glow
- Gut Health: Ginger Boost · Roots+ · Roots Refresh
- Rehydration: Melon Refresh · Roots Refresh · Citrus Glow

## Premium Wellness Reset Kits (live) — PLACEHOLDER PRICING
One-time purchase; each = 1 of every blend per day + physical extras
(Wellness Guide, checklist, welcome card).
- 1-Day Wellness Reset Kit — **$72** (juice alone $49)
- 3-Day Wellness Reset Kit — **$179** (juice alone $145)
CONFIRM prices once tote/opener/print costs are sourced. Not subscribable.

## Commerce rules built in
- Subscribe & Save = 5% off, pre-selected, monthly cadence
  (Every-2-weeks "coming soon").
- Fulfillment: Local Pickup (free, no min) · Local Delivery (≥6 btl;
  Zone1 San Leandro free, Zone2 Oakland/Alameda $5, Zone3 Hayward/Union City $8)
  · California Shipping (≥18 btl = 3-Day Reset, fee at checkout).
- Live-updating total + single "Add to cart"; slide-out cart with contextual
  cross-sell; kit buttons open a dedicated kit cart.
- Review line: 5.0 · 51 reviews.

## Decisions made (change if wrong)
- Family Pack = $96 / $8.00.
- 6-bottle "1-Day Reset" and "Wellness Pack" are ONE product (Wellness Pack).
- Zone 1 (San Leandro) local delivery = Free.
- **California Shipping re-anchored to 3-Day Reset (18 btl)** after the 5-Day was
  put on hold — was 30 btl. Confirm 18 covers cold-pack + overnight cost.
- Kit prices ($72 / $179) are placeholders.

## Images
- All 6 flavors use finished photoreal posters (images/poster-*.png).
- Label History uses archival concept drops, prep shots, v2/v3 bottles,
  studio 6-pack, campaign posters, and the Anatomy infographic.

## Stripe — COMPLETE ✅
- All 4 packs + both kits have live payment links in shop.js (no placeholders).
- Subscribe & Save (5% monthly) set on Wellness, Family, 3-Day Reset.
  Single Bottle is one-time only (subscribe toggle hidden for it).
- Dashboard done: branding (logo/green), Apple/Google Pay, shipping-address
  collection, promo codes, tax.

## OPEN — design/next steps
- Bring back the 5-Day Reset (30 btl, $235) when ready; restore its shipping min.
- Finalize "Citrus Glow" name (was temp).
- Real Stripe links pasted in (removes all "connect Stripe link" states).
