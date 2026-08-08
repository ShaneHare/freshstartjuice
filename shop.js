/* ============================================================
   RETIRED as of the Phase-1 Shop page simplification.
   No page currently loads this file -- Shop.html and checkout.html
   now carry their own small inline scripts. Left in the repo
   (not deleted) in case any of this logic is useful again later.
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
    desc: 'Sweet oranges, fresh lemons, carrots, and turmeric combine for a smooth citrus blend bursting with vibrant flavor. Sunshine in a bottle that’s made to brighten your day from the very first sip.',
    best: ['Vitamin C', 'Immune Support', 'Antioxidant Support', 'Daily Wellness']
  },
  {
    id: 'ginger-boost', name: 'Ginger Boost', img: 'images/poster-ginger-boost.png', tint: '#FCEFC7',
    blend: 'Pineapple · Ginger · Cucumber · Orange · Lemon · Vanilla · Star Anise',
    tagline: 'Bold by nature.',
    desc: 'A vibrant, spicy blend of pineapple, fresh ginger, cucumber, orange, lemon, vanilla, and star anise that delivers bright citrus flavor with a warm ginger kick. Refreshing, invigorating, and handcrafted in small batches. If you love ginger, this one’s for you.',
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
/* Used to name/link each pricing tier at checkout (Stripe one-time
   links live here). "size" is only used to lock the two premium
   Kits below to their exact bottle count. */
const PACKS = [
  { id: 'single',   size: 1,  name: 'Single Bottle',                                stripe: 'https://buy.stripe.com/9B6bJ2cohgSf42xdECeQM09' },
  { id: 'wellness', size: 6,  name: 'Freshstart Juices - Wellness Pack (6 Pack)',   stripe: 'https://buy.stripe.com/14AcN64VPdG38iN442eQM0a' },
  { id: 'family',   size: 12, name: 'Freshstart Juices - Family Pack (12 Pack)',    stripe: 'https://buy.stripe.com/aFa28scohbxVcz37geeQM0b' },
  { id: 'reset3',   size: 18, name: 'Freshstart Juices - 3-Day Reset (18 Pack)',    stripe: 'https://buy.stripe.com/aFa00kdsl45taqVbwueQM0c' }
];

/* ---- PRICING TIERS ------------------------------------------- */
/* No pack has to be chosen up front. Add any flavors in any amount —
   the per-bottle price automatically drops as the total climbs. */
const TIERS = [
  { id: 'single',   min: 1,  max: 5,   per: 9.00, packId: 'single',   label: 'Single-bottle pricing' },
  { id: 'wellness', min: 6,  max: 11,  per: 8.17, packId: 'wellness', label: 'Wellness pricing' },
  { id: 'family',   min: 12, max: 17,  per: 8.00, packId: 'family',   label: 'Family pricing' },
  { id: 'reset3',   min: 18, max: 999, per: 8.06, packId: 'reset3',   label: '3-Day Reset pricing' }
];
const MAX_BOTTLES = 30;
function tierFor(count) {
  if (count <= 0) return TIERS[0];
  return TIERS.find(t => count >= t.min && count <= t.max) || TIERS[TIERS.length - 1];
}
function nextTier(count) {
  return TIERS.find(t => t.min > count) || null;
}

/* ---- FULFILLMENT ------------------------------------------- */
const SUB_DISCOUNT = 0.05; // Subscribe & Save 5% (offered at checkout)
const ZONES = [
  { id: 'z1', name: 'San Leandro', fee: 7 },
  { id: 'z2', name: 'Oakland · Alameda · San Lorenzo · Castro Valley', fee: 10 },
  { id: 'z3', name: 'Hayward · Union City', fee: 20 }
];

/* ---- GOAL BUNDLES ------------------------------------------ */
/* Curated trios; "Build this pack" starts a 6-bottle box (2 of each) —
   customers can keep adding from there. */
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
/* One-time; each includes 1 of every blend per day + physical extras.
   Fixed size (a "1-Day" or "3-Day" program), but the flavor mix inside
   is still fully editable. */
const KITS = [
  { id: 'kit1', packId: 'wellness', name: '1-Day Wellness Reset Kit', price: 72,  perBlend: 1, days: 1, stripe: 'https://buy.stripe.com/9B65kEfAtatRaqV2ZYeQM0e' },
  { id: 'kit3', packId: 'reset3',   name: '3-Day Wellness Reset Kit', price: 179, perBlend: 3, days: 3, stripe: 'https://buy.stripe.com/9B66oIbkd7hFeHbeIGeQM0d' }
];
const KIT_EXTRAS = ['Freshstart Wellness Guide', 'Wellness checklist', 'Welcome card'];

/* ---- STATE -------------------------------------------------- */
const state = {
  box: {},                 // flavorId -> count
  focus: 'roots-refresh',
  fulfill: 'pickup',       // 'pickup' | 'delivery' | 'ship'
  zone: 'z1',
  kitId: null,             // set when a Wellness Reset Kit is selected
  cart: null
};

const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + n.toFixed(2);
const getPackById = id => PACKS.find(p => p.id === id);
const getKit = () => state.kitId ? KITS.find(k => k.id === state.kitId) : null;
const boxCount = () => Object.values(state.box).reduce((a, b) => a + b, 0);
const flavor = id => FLAVORS.find(f => f.id === id);

/* Size of the current order: a kit's fixed size, or however many
   bottles are currently in the box. */
function currentSize() {
  const kit = getKit();
  return kit ? getPackById(kit.packId).size : boxCount();
}

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

/* Which fulfillment methods are allowed for the current order size */
function fulfillAllowed(id) {
  const size = currentSize();
  if (id === 'pickup') return true;
  if (id === 'delivery') return size >= 6;
  if (id === 'ship') return size >= 18;
  return false;
}

/* ---- PRICING -------------------------------------------------- */
/* Kit or free-form tier pricing, unified. */
function pricing() {
  const kit = getKit();
  const count = boxCount();
  if (kit) {
    const pack = getPackById(kit.packId);
    return { kit, pack, tier: null, count, per: null, subtotal: kit.price, name: kit.name, packId: kit.packId, size: pack.size };
  }
  const tier = tierFor(count);
  const pack = getPackById(tier.packId);
  const subtotal = tier.per * count;
  return { kit: null, pack, tier, count, per: tier.per, subtotal, name: pack.name.replace('Freshstart Juices - ', ''), packId: tier.packId, size: count };
}

function totals() {
  const p = pricing();
  let deliveryFee = 0;
  if (state.fulfill === 'delivery') deliveryFee = ZONES.find(z => z.id === state.zone).fee;
  const shipAtCheckout = state.fulfill === 'ship';
  const total = p.subtotal + deliveryFee;
  return { ...p, deliveryFee, shipAtCheckout, total };
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  renderGallery();
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

/* ---- Fill your box ------------------------------------------ */
function renderBox() {
  const kit = getKit();
  const count = boxCount();
  const size = currentSize();
  const remaining = kit ? size - count : MAX_BOTTLES - count;

  if (kit) {
    $('#boxTitle').textContent = 'Your flavor mix';
    $('#boxCounter').innerHTML = `<strong>${count}</strong> of ${size} selected` +
      (count < size ? ` · <span class="need">add ${size - count} more</span>` : ` · <span class="done">ready — remove a flavor below to swap in another</span>`);
    $('#boxProgress').style.width = Math.min(100, (count / size) * 100) + '%';
    $('#tierInfo').innerHTML = `<div class="kit-banner"><strong>${kit.name}</strong><span>${money(kit.price)} · includes ${KIT_EXTRAS.join(', ')}</span></div>`;
  } else {
    const tier = tierFor(count);
    const next = nextTier(count);
    $('#boxTitle').textContent = 'Fill your box';
    $('#boxCounter').innerHTML = count === 0
      ? `<strong>0</strong> selected · <span class="need">add any flavors to get started</span>`
      : `<strong>${count}</strong> bottle${count === 1 ? '' : 's'} · <span class="done">${tier.label} — ${money(tier.per)}/bottle</span>`;
    $('#boxProgress').style.width = Math.min(100, (count / MAX_BOTTLES) * 100) + '%';
    $('#tierInfo').innerHTML = next
      ? `<div class="tier-hint">Add ${next.min - count} more to unlock <strong>${next.label}</strong> at ${money(next.per)}/bottle</div>`
      : (count > 0 ? `<div class="tier-hint done">You've unlocked our best pricing — ${money(tier.per)}/bottle.</div>` : '');
  }

  $('#boxSteppers').innerHTML = FLAVORS.map(f => {
    const q = state.box[f.id] || 0;
    return `<div class="stepper ${q > 0 ? 'has' : ''}" data-focus-hover="${f.id}">
      <span class="st-media">${flavorMedia(f, 'st-img')}</span>
      <span class="st-info"><span class="st-name">${f.name}</span><span class="st-blend">${f.blend}</span></span>
      <span class="st-controls">
        <button class="st-btn" data-dec="${f.id}" ${q === 0 ? 'disabled' : ''} aria-label="Remove one ${f.name}">−</button>
        <span class="st-qty">${q}</span>
        <button class="st-btn" data-inc="${f.id}" ${remaining <= 0 ? 'disabled' : ''} aria-label="Add one ${f.name}" title="${remaining <= 0 ? (kit ? 'Box is full — remove another flavor first to add more ' + f.name : 'You’ve hit the ' + MAX_BOTTLES + '-bottle order limit') : 'Add one ' + f.name}">+</button>
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
      <span class="fl-note">${allowed ? o.note : (o.id === 'delivery' ? 'Requires 6+ bottles' : 'Requires 18+ bottles')}</span>
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
  const has = boxCount() > 0;
  const perBottle = t.count > 0 ? t.subtotal / t.count : 0;
  $('#sumSubtotal').textContent = money(t.subtotal);
  $('#sumDeliveryRow').style.display = state.fulfill === 'delivery' ? 'flex' : 'none';
  $('#sumDelivery').textContent = t.deliveryFee === 0 ? 'Free' : money(t.deliveryFee);
  $('#sumTotal').textContent = money(t.total);
  $('#sumPer').textContent = t.kit ? '' : money(perBottle) + '/bottle';
  $('#sumShipNote').style.display = t.shipAtCheckout ? 'block' : 'none';
  const btn = $('#addBtn');
  if (!has) {
    btn.disabled = true;
    btn.textContent = 'Add a flavor to continue';
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
  state.cart = { kitId: state.kitId, fulfill: state.fulfill, zone: state.zone, box: { ...state.box }, total: t.total };
  const lines = FLAVORS.filter(f => state.box[f.id] > 0)
    .map(f => `<div class="cart-line"><span>${state.box[f.id]} × ${f.name}</span></div>`).join('');
  const fulfillName = { pickup: 'Local Pickup', delivery: 'Local Delivery', ship: 'California Shipping' }[state.fulfill];
  const purchaseLabel = t.kit ? 'One-time purchase' : `One-time purchase · ${t.tier.label}`;

  const kitExtras = t.kit ? `
    <div class="kit-extra-label" style="font-family:'Montserrat',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted-light);margin:0.25rem 0 0.5rem;">Also in the box</div>
    <div class="cart-lines" style="border-top:none;margin-top:0;">${KIT_EXTRAS.map(x => `<div class="cart-line"><span>1 × ${x}</span></div>`).join('')}</div>` : '';

  const subNote = !t.kit
    ? `<div class="cart-upsell"><div><strong>Subscribe & save 5%</strong><span>You'll get the option to subscribe on the next page.</span></div></div>`
    : '';

  $('#cartBody').innerHTML = `
    <div class="cart-pack">
      <div class="cart-pack-name">${t.name}</div>
      <div class="cart-pack-meta">${purchaseLabel} · ${fulfillName}</div>
    </div>
    <div class="cart-lines">${lines}</div>
    ${kitExtras}
    ${subNote}
    <div class="cart-sum">
      <div class="cs-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${state.fulfill === 'delivery' ? `<div class="cs-row"><span>Delivery</span><span>${t.deliveryFee === 0 ? 'Free' : money(t.deliveryFee)}</span></div>` : ''}
      <div class="cs-row total"><span>Total</span><span>${money(t.total)}</span></div>
      ${t.shipAtCheckout ? `<p class="cs-ship">+ shipping calculated at checkout</p>` : ''}
    </div>`;

  /* Every order -- one-time pack or kit -- routes through the checkout
     page first so we can collect contact info, an optional Subscribe &
     Save opt-in, and order notes before sending the customer to Stripe. */
  const co = $('#checkoutBtn');
  const boxStr = FLAVORS.filter(f => state.box[f.id] > 0).map(f => f.id + ':' + state.box[f.id]).join(',');
  const params = new URLSearchParams({ type: 'onetime', pack: t.packId, box: boxStr });
  if (state.kitId) params.set('kit', state.kitId);
  co.href = 'checkout.html?' + params.toString();
  co.classList.remove('is-pending');
  co.textContent = 'Continue to checkout';
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

function buildFromGoal(goalId) {
  const g = GOALS.find(x => x.id === goalId);
  if (!g) return;
  const box = {}; FLAVORS.forEach(f => box[f.id] = 0);
  g.flavors.forEach(id => box[id] = 2);      // 2 of each = 6 to start
  state.box = box;
  state.focus = g.flavors[0];
  if (!fulfillAllowed(state.fulfill)) state.fulfill = 'pickup';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Premium kit selection ---------------------------------- */
/* Kits are one-time only, but customers can still build their own flavor mix
   before checkout — same box builder as everything else, just priced and
   labeled as the kit (which also includes the guide, checklist, and card). */
function selectKit(kitId) {
  const kit = KITS.find(k => k.id === kitId);
  if (!kit) return;
  state.kitId = kit.id;
  state.box = defaultBox(getPackById(kit.packId).size);
  if (!fulfillAllowed(state.fulfill)) state.fulfill = 'pickup';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   EVENTS
   ============================================================ */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-focus],[data-inc],[data-dec],[data-fulfill],[data-zone],[data-goal],[data-kit]');
  if (el) {
    if (el.dataset.kit) {
      selectKit(el.dataset.kit);
    } else if (el.dataset.goal) {
      state.kitId = null;
      buildFromGoal(el.dataset.goal);
    } else if (el.dataset.focus) { state.focus = el.dataset.focus; renderGallery(); }
    else if (el.dataset.inc) {
      const kit = getKit();
      const limit = kit ? currentSize() : MAX_BOTTLES;
      if (boxCount() < limit) { state.box[el.dataset.inc] = (state.box[el.dataset.inc] || 0) + 1; state.focus = el.dataset.inc; render(); }
    }
    else if (el.dataset.dec) { if (state.box[el.dataset.dec] > 0) { state.box[el.dataset.dec]--; render(); } }
    else if (el.dataset.fulfill) { if (fulfillAllowed(el.dataset.fulfill)) { state.fulfill = el.dataset.fulfill; render(); } }
    else if (el.dataset.zone) { state.zone = el.dataset.zone; render(); }
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
state.box = defaultBox(6);
render();
