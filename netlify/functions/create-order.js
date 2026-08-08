/* ============================================================
   create-order
   Called by checkout.html right when the customer submits the form,
   BEFORE they're sent to Stripe. Saves the full order (flavors,
   fulfillment, contact info, notes) to Netlify Blobs with status
   "Pending Payment" so nothing is lost even if the customer never
   completes payment. stripe-webhook.js flips it to "Paid" once
   Stripe confirms the charge.
   ============================================================ */
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const required = ['product', 'size', 'price', 'name', 'email', 'phone', 'fulfillment', 'total'];
  const missing = required.filter(k => payload[k] === undefined || payload[k] === null || payload[k] === '');
  if (missing.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields: ' + missing.join(', ') }) };
  }

  const orderId = 'ord_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);

  const order = {
    orderId,
    status: 'Pending Payment',
    createdAt: new Date().toISOString(),
    product: payload.product,
    size: payload.size,
    price: payload.price,
    flavors: payload.flavors || '',
    fulfillment: payload.fulfillment,
    zone: payload.zone || '',
    deliveryFee: payload.deliveryFee || 0,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address || '',
    notes: payload.notes || '',
    total: payload.total
  };

  try {
    const store = getStore('orders');
    await store.setJSON(orderId, order);
  } catch (err) {
    console.error('create-order: failed to save order', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not save order' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  };
};
