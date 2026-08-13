/* ============================================================
   stripe-webhook
   Stripe calls this when a Payment Link checkout finishes. We verify
   the signature, find the order that create-order.js saved (matched
   by client_reference_id, which checkout.html appends to the Stripe
   link URL), flip it from "Pending Payment" to "Paid," and notify
   Shane by email.

   Requires two Netlify environment variables, set in the Netlify
   dashboard (Site settings -> Environment variables):
     STRIPE_SECRET_KEY    - from Stripe Dashboard -> Developers -> API keys
     STRIPE_WEBHOOK_SECRET - from Stripe Dashboard -> Developers -> Webhooks,
                             after registering this function's URL as an
                             endpoint listening for checkout.session.completed

   NOTE on customer confirmation emails: FormSubmit only reliably
   delivers to addresses that have completed its one-time activation
   flow, so it is used below ONLY for Shane's own inbox -- never for
   arbitrary customer addresses. For a real customer-facing payment
   confirmation, turn on Stripe's built-in receipt email instead:
   Stripe Dashboard -> Settings -> Emails -> "Successful payments."
   ============================================================ */
const Stripe = require('stripe');
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET env vars');
    return { statusCode: 500, body: 'Webhook not configured' };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('stripe-webhook: signature verification failed', err.message);
    return { statusCode: 400, body: 'Webhook signature verification failed: ' + err.message };
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Ignored event type: ' + stripeEvent.type };
  }

  const session = stripeEvent.data.object;
  const orderId = session.client_reference_id;
  if (!orderId) {
    console.warn('stripe-webhook: session had no client_reference_id', session.id);
    return { statusCode: 200, body: 'No client_reference_id on session -- nothing to update' };
  }

  const store = getStore('orders');
  const order = await store.get(orderId, { type: 'json' });
  if (!order) {
    console.warn('stripe-webhook: no saved order found for', orderId);
    return { statusCode: 200, body: 'No matching order found for ' + orderId };
  }

  order.status = 'Paid';
  order.paidAt = new Date().toISOString();
  order.stripeSessionId = session.id;
  order.amountTotalCents = session.amount_total;
  await store.setJSON(orderId, order);

  /* Stripe's own dashboard has no idea what flavors were picked --
     that only lived in our order record until now. Write it onto the
     PaymentIntent itself so it shows up right in Stripe: the
     description appears directly in the Payments list (no clicking
     required), and the full detail lands in Metadata on the payment
     page. Covers all 4 products the same way, since every paid order
     (static Payment Link or the Single Bottle Checkout Session) ends
     up here with a payment_intent. */
  if (session.payment_intent) {
    try {
      const fulfillmentSummary = order.fulfillment + (order.zone ? ' — ' + order.zone : '');
      const bumpSuffix = order.bumpIslandTea ? ' + bonus Island Citrus Tea' : '';
      const description = (order.product + bumpSuffix + ' — ' + (order.flavors || 'no flavors recorded')).slice(0, 350);
      await stripe.paymentIntents.update(session.payment_intent, {
        description,
        metadata: {
          orderId,
          product: order.product,
          size: String(order.size),
          flavors: (order.flavors || '').slice(0, 490),
          fulfillment: fulfillmentSummary.slice(0, 490),
          bumpIslandTea: order.bumpIslandTea ? 'yes' : 'no',
          notes: (order.notes || '').slice(0, 490)
        }
      });
    } catch (err) {
      console.error('stripe-webhook: failed to write flavors onto PaymentIntent', err);
    }
  } else {
    console.warn('stripe-webhook: session had no payment_intent, could not attach flavors', session.id);
  }

  try {
    const fd = new URLSearchParams();
    fd.append('_subject', '[Freshstart Juices] PAID — ' + order.name + ' — ' + order.product);
    fd.append('Order ID', orderId);
    fd.append('Status', 'Paid');
    fd.append('Product', order.product + ' (' + order.size + ' bottles)');
    fd.append('Bonus Island Citrus Tea', order.bumpIslandTea ? 'Yes (+$7)' : 'No');
    fd.append('Flavors', order.flavors);
    fd.append('Fulfillment', order.fulfillment + (order.zone ? ' — ' + order.zone : ''));
    fd.append('Name', order.name);
    fd.append('Email', order.email);
    fd.append('Phone', order.phone);
    fd.append('Address', order.address);
    fd.append('Notes', order.notes);
    fd.append('Total', order.total);
    if (typeof order.amountTotalCents === 'number') {
      fd.append('Stripe amount charged', '$' + (order.amountTotalCents / 100).toFixed(2));
    }
    fd.append('Stripe session', session.id);
    await fetch('https://formsubmit.co/ajax/info@freshstartjuiceproject.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: fd.toString()
    });
  } catch (err) {
    console.error('stripe-webhook: owner notification failed', err);
  }

  return { statusCode: 200, body: 'ok' };
};
