/* ============================================================
   Freshstart — Shop configurator
   Single source of truth for flavors, packs, fulfillment.
   Edit copy/prices here; the page renders from these objects.
   ============================================================ */

/* ---- FLAVORS (order = display order) ------------------------ */
const FLAVORS = [
  {
    id: 'pure-celery', name: 'Pure Celery', img: 'images/poster-pure-celery.png', tint: '#E8F0DC',
    blend: '100% Celery',
    tagline: 'Simple. Powerful. Real.',
    desc: '100% cold-pressed celery juice — one ingredient, nothing added. Naturally hydrating and rich in potassium and vitamin K, it’s a simple, powerful way to begin your day and stay connected to your healthy routine.',
    best: ['Hydration', 'Digestive Support', 'Potassium', 'Vitamin K']
  },
  {
    id: 'melon-refresh', name: 'Melon Refresh', img: 'images/poster-melon-refresh.png', tint: '#FBE2E6',
    blend: 'Watermelon · Lime · Ginger · Mint',
    tagline: 'Refreshment, reimagined.',
    desc: 'Crisp watermelon, zesty lime, fresh ginger, and cooling mint come together for the perfect balance of sweet and refreshing. Light, clean, and made to keep you feeling your best, one sip at a time.',
    best: ['Hydration', 'Vitamin C', 'Antioxidant Support', 'Daily Wellness']
  },
  {
    id: 'citrus-glow', name: 'Citrus Glow', img: 'images/poster-citrus-glow.png', tint: '#FDEBCE',
    blend: 'Orange · Lemon · Carrot · Turmeric',
    tagline: 'Bright starts here.',
    desc: 'Sweet oranges, fresh lemons, carrots, and turmeric combine for a smooth citrus blend bursting with vibrant flavor. Sunshine in a bottle that\u2019s made to brighten your day from the very first sip.',
    best: ['Vitamin C', 'Immune Support', 'Antioxidant Support', 'Daily Wellness']
  },
  {
    id: 'ginger-boost', name: 'Ginger Boost', img: 'images/poster-ginger-boost.png', tint: '#FCEFC7',
    blend: 'Pineapple · Ginger · Cucumber · Orange · Lemon · Vanilla · Star Anise',
    tagline: 'Bold by nature.',
    desc: 'A vibrant, spicy blend of pineapple, fresh ginger, cucumber, orange, lemon, vanilla, and star anise that delivers bright citrus flavor with a warm ginger kick. Refreshing, invigorating, and handcrafted in small batches. If you love ginger, this one\u2019s for you.',
    best: ['Digestive Support', 'Immune Support', 'Vitamin C', 'Daily Energy']
  },
  {
    id: 'roots-plus', name: 'Roots+', img: 'images/poster-roots-plus.png', tint: '#F3D9DD',
    blend: 'Beets · Cucumber · Carrot · Apple · Ginger · Lime · Turmeric · Mint',
    tagline: 'More plants. More purpose.',
    desc: 'Packed with beets, carrots, apples, cucumber, ginger, turmeric, mint, and lime, Roots+ delivers a colorful blend of fruits and vegetables in every bottle. Bold, earthy, and crafted to fuel your day with clean ingredients.',
    best: ['Daily Vegetables', 'Digestive Support', 'Circulation Support', 'Antioxidant Support']
  },
  {
    id: 'roots-refresh', name: 'Roots Refresh', img: 'images/poster-roots-refresh.png', tint: '#F6D5C8',
    blend: 'Beets · Watermelon · Ginger · Mint · Lime',
    tagline: 'Find your foundation.',
    desc: 'A refreshing blend of beets, watermelon, ginger, mint, and lime crafted to help you recharge and reset. Naturally hydrating with a smooth finish, Roots Refresh is where bold flavor meets everyday wellness.',
    best: ['Hydration', 'Circulation Support', 'Digestive Support', 'Antioxidant Support']
  }
];

/* Daily reset progression (morning -> night) */
const PROGRESSION = ['pure-celery', 'melon-refresh', 'citrus-glow', 'ginger-boost', 'roots-plus', 'roots-refresh'];

/* ---- PACKS -------------------------------------------------- */
/* stripe: paste each pack's Stripe payment link once created.
   All four packs are wired live. Kits (below) still need links. */
const PACKS = [
  { id: 'single',   size: 1,  price: 9,   name: 'Single Bottle',    tag: 'One 12 oz cold-pressed juice',              per: 9.00, stripe: 'https://buy.stripe.com/9B6bJ2cohgSf42xdECeQM09', noSub: true },
  { id: 'wellness', size: 6,  price: 49,  name: 'Freshstart Juices - Wellness Pack (6 Pack)', tag: '6 juices · mix & match any flavors', per: 8.17, stripe: 'https://buy.stripe.com/14AcN64VPdG38iN442eQM0a', featured: true },
  { id: 'family',   size: 12, price: 96,  name: 'Freshstart Juices - Family Pack (12 Pack)',   tag: '12 juices · stock the fridge',       per: 8.00, stripe: 'https://buy.stripe.com/aFa28scohbxVcz37geeQM0b' },
  { id: 'reset3',   size: 18, price: 145, name: 'Freshstart Juices - 3-Day Reset (18 Pack)',   tag: '18 juices · guided wellness program', per: 8.06, stripe: 'https://buy.stripe.com/aFa00kdsl45taqVbwueQM0c', guided: true }
];

/* ---- FULFILLMENT ------------------------------------------- */
const SUB_DISCOUNT = 0.05; // Subscribe & Save 5%
const ZONES = [
  { id: 'z1', name: 'San Leandro', fee: 0 },
  { id: 'z2', name: 'Oakland · Alameda · San Lorenzo · Castro Valley', fee: 5 },
  { id: 'z3', name: 'Hayward · Union City', fee: 8 }
];

/* ---- GOAL BUNDLES ------------------------------------------ */
/* Curated trios; "Build this pack" fills a 6-bottle Wellness Pack (2 of each). */
const GOALS = [
  { id: 'detox', name: 'Detox', tagline: 'Reset & cleanse',
    flavors: ['roots-plus', 'pure-celery', 'citrus-glow'],
    desc: 'Beets, pure celery, turmeric and citrus, the classic cleanse crew to help you reset.' },
  { id: 'gut', name: 'Gut Health', tagline: 'Soothe & support digestion',
    flavors: ['ginger-boost', 'roots-plus', 'roots-refresh'],
    desc: 'Ginger, star anise, mint and cucumber to settle the stomach and support digestion.' },
  { id: 'rehydrate', name: 'Rehydration', tagline: 'Replenish & refresh',
    flavors: ['melon-refresh', 'roots-refresh', 'citrus-glow'],
    desc: 'Watermelon, cucumber, citrus, and lime high-water blends to replenish and refresh.' }
];

/* ---- PREMIUM WELLNESS KITS --------------------------------- */
/* One-time; each includes 1 of every blend per day + physical extras. */
const KITS = [
  { id: 'kit1', name: '1-Day Wellness Reset Kit', price: 72,  perBlend: 1, days: 1, stripe: 'https://buy.stripe.com/9B65kEfAtatRaqV2ZYeQM0e' },
  { id: 'kit3', name: '3-Day Wellness Reset Kit', price: 179, perBlend: 3, days: 3, stripe: 'https://buy.stripe.com/9B66oIbkd7hFeHbeIGeQM0d' }
];
const KIT_EXTRAS = ['Freshstart Wellness Guide', 'Wellness checklist', 'Welcome card'];

/* ---- STATE -------------------------------------------------- */
const state = {
  packId: 'wellness',
  purchase: 'subscribe',   // 'subscribe' | 'onetime'
  cadence: 'monthly',
  box: {},                 // flavorId -> count
  focus: 'roots-refresh',
  fulfill: 'pickup',       // 'pickup' | 'delivery' | 'ship'
  zone: 'z1',
  cart: null
};

const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + n.toFixed(2);
const getPack = () => PACKS.find(p => p.id === state.packId);
const boxCount = () => Object.values(state.box).reduce((a, b) => a + b, 0);
const flavor = id => FLAVORS.find(f => f.id === id);

/* Default even distribution across all six flavors for a given size */
function defaultBox(size) {
  const box = {};
  FLAVORS.forEach(f => box[f.id] = 0);
  for (let i = 0; i < size; i++) {
    const id = PROGRESSION[i % PROGRESSION.length];
    box[id]++;
  }
  return box;
}

/* Which fulfillment methods are allowed for the current pack size */
function fulfillAllowed(id) {
  const size = getPack().size;
  if (id === 'pickup') return true;
  if (id === 'delivery') return size >= 6;
  if (id === 'ship') return size >= 18;
  return false;
}

/* ---- TOTALS ------------------------------------------------- */
function totals() {
  const pack = getPack();
  const sub = state.purchase === 'subscribe';
  const subtotal = pack.price;
  const savings = sub ? subtotal * SUB_DISCOUNT : 0;
  let deliveryFee = 0;
  if (state.fulfill === 'delivery') deliveryFee = ZONES.find(z => z.id === state.zone).fee;
  const shipAtCheckout = state.fulfill === 'ship';
  const total = subtotal - savings + deliveryFee;
  return { pack, sub, subtotal, savings, deliveryFee, shipAtCheckout, total };
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  renderGallery();
  renderPacks();
  renderPurchase();
  renderBox();
  renderFulfill();
  renderTotalBar();
  renderFlavorDetails();
}

/* ---- Gallery ------------------------------------------------ */
function flavorMedia(f, cls) {
  if (f.img) return `<img src="${f.img}" alt="${f.name} cold-pressed juice" class="${cls}" loading="lazy" decoding="async">`;
  return `<div class="${cls} ph" style="--ph:${f.tint}"><span>${f.name}</span><span class="ph-note">product shot</span></div>`;
}

function renderGallery() {
  const f = flavor(state.focus);
  $('#galleryMain').innerHTML = flavorMedia(f, 'gallery-img');
  $('#galleryMeta').innerHTML =
    `<div class="gm-name">${f.name}</div>
     <div class="gm-tagline">${f.tagline}</div>
     <div class="gm-blend">${f.blend}</div>
     <p class="gm-desc">${f.desc}</p>
     <div class="gm-best-label">Best for</div>
     <div class="gm-best">${f.best.map(b => `<span class="best-tag">${b}</span>`).join('')}</div>`;
  $('#galleryThumbs').innerHTML = FLAVORS.map(fl =>
    `<button class="thumb ${fl.id === state.focus ? 'is-active' : ''}" data-focus="${fl.id}" aria-label="${fl.name}">
       ${flavorMedia(fl, 'thumb-img')}
     </button>`).join('');
}

/* ---- Packs -------------------------------------------------- */
function renderPacks() {
  $('#packGrid').innerHTML = PACKS.map(p => {
    const active = p.id === state.packId;
    const save = p.featured ? '<span class="pack-flag">Most popular</span>' : (p.guided ? '<span class="pack-flag flag-alt">Guided</span>' : '');
    return `<button class="packcard ${active ? 'is-active' : ''}" data-pack="${p.id}">
      ${save}
      <span class="pc-size">${p.size} ${p.size === 1 ? 'bottle' : 'bottles'}</span>
      <span class="pc-name">${p.name.replace('Freshstart Juices - ', '')}</span>
      <span class="pc-price">${money(p.price)}</span>
      <span class="pc-per">${money(p.per)}/bottle</span>
    </button>`;
  }).join('');
}

/* ---- Purchase type + cadence -------------------------------- */
function renderPurchase() {
  // Single Bottle is one-time only — no subscription price in Stripe.
  if (getPack().noSub && state.purchase === 'subscribe') state.purchase = 'onetime';
  const sub = state.purchase === 'subscribe';
  const canSub = !getPack().noSub;
  $('#purchaseToggle').innerHTML = `
    ${canSub ? `<button class="pt-opt ${sub ? 'is-active' : ''}" data-purchase="subscribe">
      <span class="pt-head"><span class="pt-radio"></span>Subscribe & Save</span>
      <span class="pt-badge">Save 5%</span>
      <span class="pt-sub">Flexible schedule · pause or cancel anytime · priority access to new blends</span>
    </button>` : ''}
    <button class="pt-opt ${!sub ? 'is-active' : ''}" data-purchase="onetime">
      <span class="pt-head"><span class="pt-radio"></span>One-time purchase</span>
      <span class="pt-sub">A single order, no commitment.</span>
    </button>`;
  $('#cadenceWrap').style.display = sub ? 'block' : 'none';
  $('#cadenceWrap').innerHTML = sub ? `
    <div class="field-label">Delivers every</div>
    <div class="cadence-row">
      <button class="cad ${state.cadence === 'monthly' ? 'is-active' : ''}" data-cadence="monthly">Monthly <em>Recommended</em></button>
      <button class="cad is-disabled" disabled>Every 2 weeks <em>Coming soon</em></button>
    </div>` : '';
}

/* ---- Fill your box ------------------------------------------ */
function renderBox() {
  const pack = getPack();
  const count = boxCount();
  const remaining = pack.size - count;
  $('#boxTitle').textContent = pack.size === 1 ? 'Pick your flavor' : 'Fill your box';
  $('#boxCounter').innerHTML = `<strong>${count}</strong> of ${pack.size} selected` +
    (remaining > 0 ? ` · <span class="need">add ${remaining} more</span>` : ` · <span class="done">ready</span>`);
  $('#boxProgress').style.width = Math.min(100, (count / pack.size) * 100) + '%';
  $('#boxSteppers').innerHTML = FLAVORS.map(f => {
    const q = state.box[f.id] || 0;
    return `<div class="stepper ${q > 0 ? 'has' : ''}" data-focus-hover="${f.id}">
      <span class="st-media">${flavorMedia(f, 'st-img')}</span>
      <span class="st-info"><span class="st-name">${f.name}</span><span class="st-blend">${f.blend}</span></span>
      <span class="st-controls">
        <button class="st-btn" data-dec="${f.id}" ${q === 0 ? 'disabled' : ''} aria-label="Remove one ${f.name}">\u2212</button>
        <span class="st-qty">${q}</span>
        <button class="st-btn" data-inc="${f.id}" ${remaining === 0 ? 'disabled' : ''} aria-label="Add one ${f.name}">+</button>
      </span>
    </div>`;
  }).join('');
}

/* ---- Fulfillment -------------------------------------------- */
function renderFulfill() {
  const opts = [
    { id: 'pickup',   name: 'Local Pickup',      sub: 'San Leandro, CA · scheduled time', note: 'Free · no minimum' },
    { id: 'delivery', name: 'Local Delivery',    sub: 'Delivered across the East Bay',    note: 'Fee by zone · 6-bottle minimum' },
    { id: 'ship',     name: 'California Shipping', sub: 'Insulated packaging + ice packs', note: 'Statewide · 18-bottle minimum' }
  ];
  $('#fulfillGrid').innerHTML = opts.map(o => {
    const allowed = fulfillAllowed(o.id);
    const active = state.fulfill === o.id && allowed;
    return `<button class="fulfill ${active ? 'is-active' : ''} ${allowed ? '' : 'is-disabled'}" data-fulfill="${o.id}" ${allowed ? '' : 'disabled'}>
      <span class="fl-head"><span class="fl-radio"></span>${o.name}</span>
      <span class="fl-sub">${o.sub}</span>
      <span class="fl-note">${allowed ? o.note : (o.id === 'delivery' ? 'Requires 6+ bottles' : 'Requires the 18-bottle 3-Day Reset')}</span>
    </button>`;
  }).join('');
  const showZones = state.fulfill === 'delivery' && fulfillAllowed('delivery');
  $('#zoneWrap').style.display = showZones ? 'block' : 'none';
  if (showZones) {
    $('#zoneWrap').innerHTML = `<div class="field-label">Your delivery zone</div>
      <div class="zone-list">${ZONES.map(z =>
        `<button class="zone ${state.zone === z.id ? 'is-active' : ''}" data-zone="${z.id}">
           <span>${z.name}</span><span class="zone-fee">${z.fee === 0 ? 'Free' : money(z.fee)}</span>
         </button>`).join('')}
        <p class="zone-note">Outside these areas? Choose California Shipping — final fee calculated at checkout.</p>
      </div>`;
  }
}

/* ---- Total bar + CTA ---------------------------------------- */
function renderTotalBar() {
  const t = totals();
  const full = boxCount() === t.pack.size;
  const perBottle = t.total / t.pack.size;
  $('#sumSubtotal').textContent = money(t.subtotal);
  $('#sumSaveRow').style.display = t.savings > 0 ? 'flex' : 'none';
  $('#sumSave').textContent = '\u2212' + money(t.savings);
  $('#sumDeliveryRow').style.display = state.fulfill === 'delivery' ? 'flex' : 'none';
  $('#sumDelivery').textContent = t.deliveryFee === 0 ? 'Free' : money(t.deliveryFee);
  $('#sumTotal').textContent = money(t.total);
  $('#sumPer').textContent = money(perBottle) + '/bottle';
  $('#sumShipNote').style.display = t.shipAtCheckout ? 'block' : 'none';
  const btn = $('#addBtn');
  if (!full) {
    btn.disabled = true;
    btn.textContent = `Add ${t.pack.size - boxCount()} more to continue`;
  } else {
    btn.disabled = false;
    btn.innerHTML = `Add to cart · ${money(t.total)}`;
  }
}

/* ============================================================
   FLAVOR DETAIL CARDS (lower on page)
   ============================================================ */
function renderFlavorDetails() {
  const wrap = $('#flavorDetails');
  if (!wrap || wrap.dataset.done) return;
  wrap.innerHTML = FLAVORS.map(f => `
    <article class="fd-card">
      <div class="fd-media">${flavorMedia(f, 'fd-img')}</div>
      <div class="fd-body">
        <h3 class="fd-name">${f.name}</h3>
        <p class="fd-tagline">${f.tagline}</p>
        <p class="fd-blend">${f.blend}</p>
        <p class="fd-desc">${f.desc}</p>
        <div class="fd-best-label">Best for</div>
        <div class="fd-best">${f.best.map(b => `<span class="best-tag">${b}</span>`).join('')}</div>
      </div>
    </article>`).join('');
  wrap.dataset.done = '1';
}

/* ============================================================
   CART DRAWER
   ============================================================ */
function openCart() {
  const t = totals();
  state.cart = { packId: state.packId, purchase: state.purchase, cadence: state.cadence,
                 fulfill: state.fulfill, zone: state.zone, box: { ...state.box }, total: t.total };
  const lines = FLAVORS.filter(f => state.box[f.id] > 0)
    .map(f => `<div class="cart-line"><span>${state.box[f.id]} × ${f.name}</span></div>`).join('');
  const fulfillName = { pickup: 'Local Pickup', delivery: 'Local Delivery', ship: 'California Shipping' }[state.fulfill];
  const purchaseLabel = t.sub ? `Subscription · delivers monthly` : 'One-time purchase';

  // contextual cross-sell
  let upsell = '';
  if (!t.sub && !t.pack.noSub) {
    upsell = `<div class="cart-upsell"><div><strong>Subscribe & save 5%</strong><span>Same box, delivered monthly — pause anytime.</span></div><button class="upsell-btn" data-upsell="subscribe">Switch</button></div>`;
  } else if (t.pack.size <= 6) {
    upsell = `<div class="cart-upsell"><div><strong>Upgrade to the 12-bottle Family Pack</strong><span>Drop to $8.00/bottle and stock the fridge.</span></div><button class="upsell-btn" data-upsell="family">Add</button></div>`;
  }

  $('#cartBody').innerHTML = `
    <div class="cart-pack">
      <div class="cart-pack-name">${t.pack.name}</div>
      <div class="cart-pack-meta">${purchaseLabel} · ${fulfillName}</div>
    </div>
    <div class="cart-lines">${lines}</div>
    ${upsell}
    <div class="cart-sum">
      <div class="cs-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${t.savings > 0 ? `<div class="cs-row save"><span>Subscribe & Save (5%)</span><span>\u2212${money(t.savings)}</span></div>` : ''}
      ${state.fulfill === 'delivery' ? `<div class="cs-row"><span>Delivery</span><span>${t.deliveryFee === 0 ? 'Free' : money(t.deliveryFee)}</span></div>` : ''}
      <div class="cs-row total"><span>Total</span><span>${money(t.total)}</span></div>
      ${t.shipAtCheckout ? `<p class="cs-ship">+ shipping calculated at checkout</p>` : ''}
    </div>`;

  const co = $('#checkoutBtn');
  if (t.pack.stripe) {
    co.href = t.pack.stripe;
    co.classList.remove('is-pending');
    co.textContent = 'Checkout';
  } else {
    co.removeAttribute('href');
    co.classList.add('is-pending');
    co.textContent = 'Checkout (connect Stripe link)';
  }
  $('#cartBadge').textContent = boxCount();
  $('#cartBadge').style.display = 'grid';
  document.body.classList.add('cart-open');
}
function closeCart() { document.body.classList.remove('cart-open'); }

/* ---- Goal bundles ------------------------------------------ */
function renderGoals() {
  const wrap = $('#goalGrid');
  if (!wrap || wrap.dataset.done) return;
  wrap.innerHTML = GOALS.map(g => `
    <article class="goalcard">
      <div class="goal-head">
        <span class="goal-name">${g.name}</span>
        <span class="goal-tag">${g.tagline}</span>
      </div>
      <div class="goal-thumbs">
        ${g.flavors.map(id => { const f = flavor(id); return `<span class="goal-thumb">${flavorMedia(f, 'gt-img')}</span>`; }).join('')}
      </div>
      <div class="goal-flavs">${g.flavors.map(id => flavor(id).name).join(' · ')}</div>
      <p class="goal-desc">${g.desc}</p>
      <button class="goal-btn" data-goal="${g.id}">Build this pack</button>
    </article>`).join('');
  wrap.dataset.done = '1';
}

function buildFromGoal(goalId) {  const g = GOALS.find(x => x.id === goalId);
  if (!g) return;
  state.packId = 'wellness';                 // 6-bottle pack
  const box = {}; FLAVORS.forEach(f => box[f.id] = 0);
  g.flavors.forEach(id => box[id] = 2);      // 2 of each = 6
  state.box = box;
  state.focus = g.flavors[0];
  if (!fulfillAllowed(state.fulfill)) state.fulfill = 'pickup';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Premium kit cart -------------------------------------- */
function openKitCart(kitId) {
  const kit = KITS.find(k => k.id === kitId);
  if (!kit) return;
  const bottles = kit.perBlend * FLAVORS.length;
  state.cart = { kit: kit.id };
  const lines = FLAVORS.map(f => `<div class="cart-line"><span>${kit.perBlend} × ${f.name}</span></div>`).join('');
  const extras = KIT_EXTRAS.map(x => `<div class="cart-line"><span>1 × ${x}</span></div>`).join('');
  $('#cartBody').innerHTML = `
    <div class="cart-pack">
      <div class="cart-pack-name">${kit.name}</div>
      <div class="cart-pack-meta">One-time purchase · pickup or local delivery</div>
    </div>
    <div class="cart-lines">${lines}</div>
    <div class="kit-extra-label" style="font-family:'Montserrat',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted-light);margin:0.25rem 0 0.5rem;">In the box</div>
    <div class="cart-lines" style="border-top:none;margin-top:0;">${extras}</div>
    <div class="cart-sum">
      <div class="cs-row total"><span>Total</span><span>${money(kit.price)}</span></div>
      <p class="cs-ship">${bottles} juices + wellness extras · taxes at checkout</p>
    </div>`;
  const co = $('#checkoutBtn');
  if (kit.stripe) { co.href = kit.stripe; co.classList.remove('is-pending'); co.textContent = 'Checkout'; }
  else { co.removeAttribute('href'); co.classList.add('is-pending'); co.textContent = 'Checkout (connect Stripe link)'; }
  $('#cartBadge').textContent = bottles;
  $('#cartBadge').style.display = 'grid';
  document.body.classList.add('cart-open');
}

/* ============================================================
   EVENTS
   ============================================================ */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-pack],[data-purchase],[data-cadence],[data-focus],[data-inc],[data-dec],[data-fulfill],[data-zone],[data-upsell],[data-goal],[data-kit]');
  if (el) {
    if (el.dataset.kit) {
      openKitCart(el.dataset.kit);
    } else if (el.dataset.goal) {
      buildFromGoal(el.dataset.goal);
    } else if (el.dataset.pack) {
      state.packId = el.dataset.pack;
      state.box = defaultBox(getPack().size);
      if (!fulfillAllowed(state.fulfill)) state.fulfill = 'pickup';
      render();
    } else if (el.dataset.purchase) { state.purchase = el.dataset.purchase; render(); }
    else if (el.dataset.cadence) { state.cadence = el.dataset.cadence; render(); }
    else if (el.dataset.focus) { state.focus = el.dataset.focus; renderGallery(); }
    else if (el.dataset.inc) { if (boxCount() < getPack().size) { state.box[el.dataset.inc] = (state.box[el.dataset.inc] || 0) + 1; state.focus = el.dataset.inc; render(); } }
    else if (el.dataset.dec) { if (state.box[el.dataset.dec] > 0) { state.box[el.dataset.dec]--; render(); } }
    else if (el.dataset.fulfill) { if (fulfillAllowed(el.dataset.fulfill)) { state.fulfill = el.dataset.fulfill; render(); } }
    else if (el.dataset.zone) { state.zone = el.dataset.zone; render(); }
    else if (el.dataset.upsell) {
      if (el.dataset.upsell === 'subscribe') state.purchase = 'subscribe';
      else { state.packId = el.dataset.upsell; state.box = defaultBox(getPack().size); }
      render(); openCart();
    }
    return;
  }
  if (e.target.closest('#addBtn') && !$('#addBtn').disabled) { openCart(); }
  if (e.target.closest('#cartClose') || e.target.id === 'cartScrim' || e.target.closest('#cartBadgeBtn')) {
    if (e.target.closest('#cartBadgeBtn') && state.cart) { openCart(); } else { closeCart(); }
  }
});

/* hover a stepper -> preview that flavor in gallery */
document.addEventListener('mouseover', e => {
  const s = e.target.closest('[data-focus-hover]');
  if (s && s.dataset.focusHover !== state.focus) { state.focus = s.dataset.focusHover; renderGallery(); }
});

/* ---- FAQ accordion ----------------------------------------- */
document.addEventListener('click', e => {
  const q = e.target.closest('.faq-q');
  if (q) { q.parentElement.classList.toggle('open'); }
});

/* init */
renderGoals();
state.box = defaultBox(getPack().size);
render();
