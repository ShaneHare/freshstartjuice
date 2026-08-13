/* ============================================================
   create-checkout-session
   Creates a real Stripe Checkout Session server-side for any of the 4
   products, with the correct line items as a dynamic combination:
     - the base product at its real Stripe Price (quantity = customer's
       chosen count for Single Bottle, since it has no fixed size and
       Payment Links can't be pre-filled with a quantity via URL
       parameter -- confirmed by hand, both ?quantity= and
       ?prefilled_quantity= are silently ignored; quantity is always 1
       for the 3 fixed packs, since each pack's Price already represents
       the full multi-bottle pack at one price)
     - an optional $7 "Island Citrus Tea -- Bonus Bottle" order bump,
       added as a second line item using price_data (inline ad-hoc
       pricing) since it's a promo price, not a stored Stripe Price

   This replaced the old Single-Bottle-only version once the order bump
   needed to combine a second, checkout.html-decided line item with the
   base product -- something a static Payment Link can't do. All 4
   products now route through this function; their old static Payment
   Links are kept only as a manual-fallback safety net if this function
   is ever unreachable (see checkout.html's submit handler).
   ============================================================ */
const Stripe = require('stripe');

const PRICE_IDS = {
  single:   'price_1TlfyvLObZrlzLTVufjhhFdQ', // Single Bottle -- $9.00
  wellness: 'price_1Tr28JLObZrlzLTVn9Sk23Wt',  // Wellness Pack -- $49.00
  family:   'price_1Tr2NpLObZrlzLTVlGwPoWEA',  // Family Pack -- $96.00
  reset3:   'price_1Tr2cHLObZrlzLTVOuiHIL44'   // 3-Day Wellness Reset -- $145.00
};

const BUMP_PRICE_CENTS = 700; // $7.00 Island Citrus Tea bonus bottle

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('create-checkout-session: missing STRIPE_SECRET_KEY env var');
    return { statusCode: 500, body: JSON.stringify({ error: 'Not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const productId = payload.product;
  const priceId = PRICE_IDS[productId];
  if (!priceId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown product' }) };
  }

  // Only Single Bottle has a customer-chosen quantity; the 3 fixed packs
  // always charge quantity 1 against their pack-level Price.
  const quantity = productId === 'single' ? Number(payload.quantity) : 1;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid quantity' }) };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const line_items = [{ price: priceId, quantity }];

  if (payload.bump === true) {
    line_items.push({
      price_data: {
        currency: 'usd',
        unit_amount: BUMP_PRICE_CENTS,
        product_data: { name: 'Island Citrus Tea - Bonus Bottle' }
      },
      quantity: 1
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      client_reference_id: payload.orderId || undefined,
      automatic_tax: { enabled: true },
      success_url: 'https://freshstartjuiceproject.com/thank-you.html',
      cancel_url: 'https://freshstartjuiceproject.com/checkout.html?product=' + encodeURIComponent(productId)
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('create-checkout-session: stripe error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create checkout session' }) };
  }
};
