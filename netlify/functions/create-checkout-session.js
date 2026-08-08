/* ============================================================
   create-checkout-session
   Used only by the Single Bottle product, since it has no fixed
   quantity -- customers can buy any number of bottles at $9 each.
   Stripe Payment Links can't be pre-filled with a quantity via URL
   parameter (confirmed by hand, both ?quantity= and
   ?prefilled_quantity= are silently ignored), so a static Payment
   Link can't charge the right total for more than 1 bottle. This
   function creates a real Stripe Checkout Session server-side with
   the exact quantity as a line item instead, which always charges
   correctly with no manual step for the customer.

   Wellness Pack, Family Pack, and the 3-Day Reset are fixed-size and
   keep using their existing static Payment Links -- this function is
   not involved in those flows.
   ============================================================ */
const Stripe = require('stripe');

const SINGLE_BOTTLE_PRICE_ID = 'price_1TlfyvLObZrlzLTVufjhhFdQ';

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

  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid quantity' }) };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: SINGLE_BOTTLE_PRICE_ID, quantity }],
      client_reference_id: payload.orderId || undefined,
      automatic_tax: { enabled: true },
      success_url: 'https://freshstartjuiceproject.com/thank-you.html',
      cancel_url: 'https://freshstartjuiceproject.com/checkout.html?product=single'
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
