/* ═══════════════════════════════════════════════════════
   Fibe × Great.Cards — Frontend (v2.0 — 4-page shell)
   Partner token is NEVER in this file. All calls → /api/*
═══════════════════════════════════════════════════════ */

// ─── State ───────────────────────────────────────────────────────────────────

const state = {
  creditScore:    750,
  monthlyIncome:  65000,
  employmentType: 'salaried',
  pincode:        '400001',
  bankMap:        {},
  bankLogoMap:    {},
  initCards:      [],
  initLoaded:     false,

  // demo page
  activeTab:       'placements',
  activePlacement: 1,

  // homepage funnel (defaults from 01-PROTOTYPE.md line 50)
  funnel: {
    disbursals: 350000,
    seeRate:    3,   // %
    clickRate:  40,  // %
    approvRate: 50,  // %
    commission: 2000,
  },
};

// ─── Constants ───────────────────────────────────────────────────────────────

const PLACEMENTS = [
  { id: 1, name: 'Homepage widget',              blurb: 'Trending tile → webview funnel (categories + spend slider)',  filter: { match: true },         n: 3,
    tryThis: 'Inside the phone, scroll down past the teal "10 YEARS" hero, past the Instant Cash / Credit Score snap cards, past "Hand-picked for you" and the "Fibe HUB" pill. Stop at the "Trending" row. Swipe that row sideways (it scrolls horizontally) — skip past the Vouchers and Fixed Deposits tiles until you hit the pulsing teal tile labelled "✨ POWERED BY GREAT.CARDS · Find your best credit card". Tap it to launch the funnel, pick 2–3 categories, set ₹ spend per category on the sliders, and watch three matched cards appear. Flip the credit-score pill above the phone — eligibility updates in real time.' },
  { id: 2, name: 'Loan declined',                blurb: 'FD section → GC webview · secured cards',                     filter: { secured: true },       n: 4,
    tryThis: 'This is what a rejected user sees instead of dead-end messaging. The FD-backed card pitch lives inside the FD section they already trust. Switch pincode to 400088 vs 400001 to see the served-vs-unserved fork.' },
  { id: 3, name: 'Post-disbursal thank-you',     blurb: 'Confetti success screen · card CTA',                          filter: { premium: true },       n: 2,
    tryThis: 'Fires ~2 hrs after disbursal — psychological peak for cross-sell. Notice the card CTA sits BELOW the celebration, not inside it. Emotion first, card second. This is priority #1 in the system.' },
  { id: 4, name: 'EMI tracker / repayment',      blurb: 'EMI schedule page · "rewards pay your EMI" card',             filter: { ltf: true },           n: 2,
    tryThis: 'User opens this to check their loan. The card tile is placed where the "rewards = 1 free EMI" math clicks fastest. Bump income higher to see the reward-offset math scale with spend capacity.' },
  { id: 5, name: 'Sanctioned email',             blurb: 'Email body, deep-links back to app',                          filter: { premium: true },       n: 2, email: true,
    tryThis: 'Email preview — not a phone screen. Ships at approval + 24 hrs. Deep-links back to the app with card reco pre-loaded. Change credit score to see the card pick rotate from LTF → premium.' },
  { id: 6, name: 'Trending row tile',            blurb: 'Featured LTF card of the week in Trending carousel',          filter: { ltf: true, popular: true }, n: 1,
    tryThis: 'One featured card, high-impact placement. Change the credit score pill to see the featured card rotate — low scores surface LTF, high scores surface premium.' },
  { id: 7, name: 'Tailor-made offers carousel',  blurb: 'Credit-score page · "Super offer" 2-col grid slot',           filter: { match: true },         n: 3, carousel: true,
    tryThis: 'Users on this page already care about their score. The 3-card grid reshuffles on every profile change. Try toggling Salaried ↔ Self-employed — different cards surface.' },
  { id: 8, name: 'Play & Win — LTF unlock',      blurb: 'Slash-the-Fruits reward surface · 3-win unlock',              filter: { ltf: true },           n: 3, game: true,
    tryThis: 'Gamified LTF unlock. 3 wins in Slash-the-Fruits = free card. The unlocked card matches user eligibility — change score to see the reward change.' },
];

// Per-category spend defaults (₹/mo) + reward rates used for projected earnings.
// These power the multi-slider step in Placement 1 and any hook that reuses it.
const CATEGORY_META = {
  online:  { defaultSpend: 15000, rate: 0.05, q: 'How much do you spend online each month?' },
  fuel:    { defaultSpend: 8000,  rate: 0.05, q: 'How much do you spend on fuel each month?' },
  dining:  { defaultSpend: 5000,  rate: 0.05, q: 'How much do you spend on dining out each month?' },
  travel:  { defaultSpend: 10000, rate: 0.04, q: 'How much do you spend on travel each month?' },
  grocery: { defaultSpend: 8000,  rate: 0.03, q: 'How much do you spend on groceries each month?' },
  bills:   { defaultSpend: 4000,  rate: 0.02, q: 'How much do you spend on utility bills each month?' },
  ott:     { defaultSpend: 1500,  rate: 0.02, q: 'How much do you spend on OTT & gaming each month?' },
  edu:     { defaultSpend: 3000,  rate: 0.01, q: 'How much do you spend on education each month?' },
};

const LOAN_PURPOSE_SPEND = {
  travel:    { flights_annual: 60000,  hotels_annual: 30000 },
  shopping:  { amazon_spends: 10000,   flipkart_spends: 8000 },
  medical:   { other_online_spends: 10000 },
  education: { school_fees: 15000 },
  home:      { other_offline_spends: 20000 },
  wedding:   { dining_or_going_out: 15000, other_offline_spends: 30000 },
  vehicle:   { fuel: 8000 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bucketScore(s) {
  if (s <= 624) return 600;
  if (s <= 699) return 650;
  if (s <= 774) return 750;
  return 800;
}
function roundIncome(v) { return Math.round(v / 10000) * 10000; }
function fmt(n)          { return Number(n || 0).toLocaleString('en-IN'); }
function inrCr(rupees)   {
  const cr = rupees / 1e7;
  if (cr >= 1)  return '₹' + cr.toFixed(2) + ' Cr';
  const l = rupees / 1e5;
  if (l >= 1)   return '₹' + l.toFixed(2) + ' L';
  return '₹' + fmt(Math.round(rupees));
}

function buildCalculateBody(overrides = {}) {
  return {
    amazon_spends: 0, flipkart_spends: 0, other_online_spends: 0,
    other_offline_spends: 0, grocery_spends_online: 0, mobile_phone_bills: 0,
    electricity_bills: 0, water_bills: 0, fuel: 0, insurance_health_annual: 0,
    insurance_car_or_bike_annual: 0, school_fees: 0, rent: 0,
    flights_annual: 0, hotels_annual: 0,
    domestic_lounge_usage_quarterly: 0, international_lounge_usage_quarterly: 0,
    dining_or_going_out: 0, online_food_ordering: 0,
    life_insurance: 0, offline_grocery: 0,
    ...overrides,
  };
}

// ─── API client ──────────────────────────────────────────────────────────────

async function apiPost(endpoint, body) {
  const res  = await fetch('/api/' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}
async function apiGet(endpoint) {
  const res  = await fetch('/api/' + endpoint);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}

async function loadInitBundle() {
  if (state.initLoaded) return;
  try {
    const data  = await apiGet('init');
    const inner = data?.data || {};
    (inner.bank_data || []).forEach(b => {
      state.bankMap[b.id]     = b.name;
      state.bankLogoMap[b.id] = b.logo || null;
    });
    state.initCards  = inner.card_data || [];
    state.initLoaded = true;
  } catch (e) {
    console.warn('[Init] Could not load init bundle:', e.message);
  }
}

// ─── Card normalisation + client-side filtering ─────────────────────────────
// Note: we filter the init-bundle cards client-side. The /cards and /calculate
// upstream endpoints return empty on this partner key's UAT sandbox.

function normalizeCard(raw) {
  if (!raw) return null;
  const alias      = raw.seo_card_alias || raw.card_alias || raw.alias || '';
  const name       = (raw.name || raw.card_name || 'Credit Card').trim();
  const bankId     = raw.bank_id;
  const bank       = bankId ? (state.bankMap[bankId] || '') : (raw.bank_name || '');
  const joiningFee = parseFloat(raw.joining_fee || 0);
  const annualFee  = parseFloat(raw.annual_fee || 0);
  const isLTF      = joiningFee === 0 && annualFee === 0;
  const usp        = (raw.product_usps || [])[0];
  const uspText    = usp ? (usp.header + ' ' + (usp.description || '')).trim() : '';
  const minIncome  = parseFloat(raw.income || 0);
  const minScore   = parseFloat(raw.crif || 0);
  return { alias, name, bank, bankId, isLTF, joiningFee, annualFee, uspText, minIncome, minScore };
}

// Secured / FD-backed cards (by name keyword — init bundle doesn't tag them)
const SECURED_ALIASES = ['step-up-credit-card', 'insta-easy-credit-card', 'au-altura-credit-card'];
// Premium aliases for post-disbursal / sanctioned email
const PREMIUM_ALIASES = ['hdfc-regalia-gold-credit-card', 'axis-magnus-credit-card', 'amex-platinum-travel-credit-card', 'sbi-elite-credit-card', 'hdfc-millennia-credit-card'];

function filterInitCards(placement) {
  const f = placement.filter || {};
  const score = bucketScore(state.creditScore);
  const income = roundIncome(state.monthlyIncome);
  let cards = (state.initCards || []).slice();

  // employment match
  cards = cards.filter(c =>
    !c.employment_type ||
    c.employment_type === 'both' ||
    c.employment_type === state.employmentType);

  // eligibility gates — user's score + income must clear card minimums
  cards = cards.filter(c => (parseFloat(c.crif || 0) <= score) && (parseFloat(c.income || 0) <= income));

  if (f.ltf) {
    cards = cards.filter(c => parseFloat(c.joining_fee || 0) === 0 && parseFloat(c.annual_fee || 0) === 0);
  }
  if (f.secured) {
    // for the loan-declined placement — prefer secured cards, pad with entry-level LTF so we always have enough
    const s = cards.filter(c => SECURED_ALIASES.includes(c.seo_card_alias));
    const need = (placement.n || 4) - s.length;
    if (need > 0) {
      const pad = cards.filter(c => !s.includes(c) && parseFloat(c.joining_fee || 0) === 0).slice(0, need);
      cards = [...s, ...pad];
    } else {
      cards = s;
    }
  }
  if (f.premium) {
    let p = cards.filter(c => PREMIUM_ALIASES.includes(c.seo_card_alias));
    if (!p.length) p = cards.filter(c => parseFloat(c.annual_fee || 0) >= 500);
    cards = p;
  }
  if (f.popular) {
    cards = cards.sort((a, b) => parseFloat(a.priority || 99) - parseFloat(b.priority || 99));
  }
  if (f.match) {
    // "tailor-made" — highest-priority cards that match user profile
    cards = cards.sort((a, b) => parseFloat(a.priority || 99) - parseFloat(b.priority || 99));
  }

  // default sort: priority asc (lower = better placement)
  if (!f.popular && !f.match) {
    cards = cards.sort((a, b) => parseFloat(a.priority || 99) - parseFloat(b.priority || 99));
  }

  return cards.slice(0, placement.n).map(normalizeCard).filter(Boolean);
}

// ─── API status indicator ───────────────────────────────────────────────────

async function updateApiStatus() {
  const dot  = document.getElementById('apiDot');
  const text = document.getElementById('apiText');
  try {
    const res = await fetch('/api/status');
    const j   = await res.json();
    if (j.ok) {
      dot.className  = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
      text.textContent = 'live · API ready';
    } else { throw new Error(); }
  } catch {
    dot.className  = 'w-1.5 h-1.5 rounded-full bg-red-400';
    text.textContent = 'API offline';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// ROUTER
// ═════════════════════════════════════════════════════════════════════════════

const ROUTES = {
  '/':        { page: 'home',     mount: mountHome },
  '/demo':    { page: 'demo',     mount: mountDemo },
  '/revenue': { page: 'revenue',  mount: mountRevenue },
  '/deck':    { page: 'deck',     mount: mountDeck },
};

function route() {
  const path = location.pathname;
  const r    = ROUTES[path] || { page: '404' };

  // toggle page visibility
  document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById('page-' + r.page);
  if (target) target.classList.remove('hidden');

  // mark active nav
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('text-teal', a.dataset.nav === r.page);
  });

  // scroll up
  window.scrollTo(0, 0);

  // mount page
  if (r.mount) r.mount();

  // body bg swap — light for home/revenue, dark for demo
  document.body.className = (r.page === 'demo' || r.page === 'deck')
    ? 'font-sans bg-panel text-slate-200 antialiased'
    : 'font-sans bg-white text-ink antialiased';
}

// Intercept all <a data-link> clicks for SPA navigation
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return;
  e.preventDefault();
  if (location.pathname !== href) {
    history.pushState({}, '', href);
    route();
  }
});
window.addEventListener('popstate', route);

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: HOMEPAGE
// ═════════════════════════════════════════════════════════════════════════════

function mountHome() {
  renderHeroFunnel();
}

function renderHeroFunnel() {
  const f   = state.funnel;
  const el  = document.getElementById('heroFunnel');
  if (!el) return;

  el.innerHTML = `
    <input class="inp" type="number" data-key="disbursals" value="${f.disbursals}" min="10000" max="2000000" step="10000"/>
    disbursals/month ×
    <input class="inp" type="number" data-key="seeRate" value="${f.seeRate}" min="0.1" max="100" step="0.1"/>%
    see card ×
    <input class="inp" type="number" data-key="clickRate" value="${f.clickRate}" min="0.1" max="100" step="0.5"/>%
    click ×
    <input class="inp" type="number" data-key="approvRate" value="${f.approvRate}" min="0.1" max="100" step="0.5"/>%
    approved × ₹<input class="inp" type="number" data-key="commission" value="${f.commission}" min="100" max="10000" step="100"/>
    <span class="eq">= <span id="heroOut">${computeHero(f)}</span></span>
  `;

  el.querySelectorAll('.inp').forEach(inp => {
    inp.addEventListener('input', () => {
      const k = inp.dataset.key;
      const v = parseFloat(inp.value) || 0;
      state.funnel[k] = v;
      document.getElementById('heroOut').textContent = computeHero(state.funnel);
    });
  });
}

function computeHero(f) {
  const monthly = f.disbursals * (f.seeRate/100) * (f.clickRate/100) * (f.approvRate/100) * f.commission;
  return inrCr(monthly) + '/month';
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: DEMO SHELL
// ═════════════════════════════════════════════════════════════════════════════

let demoBound = false;

function mountDemo() {
  if (!demoBound) {
    bindDemoControls();
    demoBound = true;
  }
  // default tab = placements, default placement = 1
  activateTab(state.activeTab);
}

function bindDemoControls() {
  // Score pills
  document.querySelectorAll('#scorePills .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#scorePills .pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.creditScore = parseInt(btn.dataset.score, 10);
      refreshActivePlacement();
    });
  });

  // Income slider
  const slider = document.getElementById('incomeSlider');
  const label  = document.getElementById('incomeLabel');
  slider.addEventListener('input', () => {
    state.monthlyIncome = parseInt(slider.value, 10);
    label.textContent = '₹' + fmt(state.monthlyIncome);
  });
  slider.addEventListener('change', refreshActivePlacement);

  // Employment
  document.querySelectorAll('.emp').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.emp').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.employmentType = btn.dataset.emp;
      refreshActivePlacement();
    });
  });

  // Pincode + city/state lookup
  const pin   = document.getElementById('pincodeInput');
  const pinC  = document.getElementById('pincodeCity');
  async function resolvePincode() {
    state.pincode = pin.value.trim();
    if (state.pincode.length === 6) {
      try {
        const r = await fetch('/api/city/' + state.pincode);
        const j = await r.json();
        if (j.ok) {
          pinC.textContent = j.city + ', ' + j.state;
          state.city = j.city; state.stateName = j.state;
        } else {
          pinC.textContent = 'pincode not found';
        }
      } catch { pinC.textContent = ''; }
    } else { pinC.textContent = '—'; }
  }
  pin.addEventListener('input', resolvePincode);
  resolvePincode(); // initial call for default 400001

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });
}

function activateTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  if (tab === 'placements')         renderPlacementsTab();
  else if (tab === 'notifications') renderNotificationsTab();
  else if (tab === 'hooks')         renderHooksTab();
}

// ─── Tab 1: In-App Placements ────────────────────────────────────────────────

function renderPlacementsTab() {
  const extra = document.getElementById('tabExtra');
  extra.innerHTML = `
    <div id="placementTryThis"></div>
    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
      <p class="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-3">Placements · 8 touchpoints</p>
      <div class="space-y-1">
        ${PLACEMENTS.map(p => `
          <div class="placement-item ${p.id === state.activePlacement ? 'active' : ''}" data-pid="${p.id}">
            <span class="num">${p.id}</span>
            <div class="name">
              ${p.name}
              <div style="font-size:11px;font-weight:500;color:#64748b;margin-top:2px">${p.blurb}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  extra.querySelectorAll('.placement-item').forEach(el => {
    el.addEventListener('click', () => {
      const pid = parseInt(el.dataset.pid, 10);
      state.activePlacement = pid;
      extra.querySelectorAll('.placement-item').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      renderPlacement(pid);
      renderPlacementTryThis(pid);
    });
  });
  renderPlacement(state.activePlacement);
  renderPlacementTryThis(state.activePlacement);
}

// Stakeholder commentary — tells the reader exactly what to do on this placement.
// Shown in the right strip, below the placement list, auto-refreshes on selection.
function renderPlacementTryThis(pid) {
  const wrap = document.getElementById('placementTryThis');
  if (!wrap) return;
  const p = PLACEMENTS.find(x => x.id === pid);
  if (!p) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div style="margin-bottom:14px;background:rgba(94,234,212,0.08);border:1px solid rgba(94,234,212,0.25);border-radius:12px;padding:14px 16px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:10px;font-weight:800;letter-spacing:0.18em;color:#5eead4;text-transform:uppercase">Try this →</span>
        <span style="font-size:11px;color:#94a3b8">Placement ${p.id} · ${escapeHtml(p.name)}</span>
      </div>
      <p style="font-size:12.5px;color:#e2e8f0;line-height:1.55">${escapeHtml(p.tryThis || '')}</p>
    </div>
  `;
}

function refreshActivePlacement() {
  if (state.activeTab === 'placements') renderPlacement(state.activePlacement);
  else if (state.activeTab === 'notifications') renderNotifCohort();
}

// ═══ Placement dispatcher ═══════════════════════════════════════════════════
// Each placement is a Fibe-native surface, not a generic card-list shell.
// Hooks (Tab 3) re-use these renderers via renderHookSurface(surface, cards, hook).

let p1FunnelState = { step: 0, cats: [], spendByCat: {} };

function renderPlacement(pid) {
  const p = PLACEMENTS.find(x => x.id === pid);
  if (!p) return;
  const phone = document.getElementById('phoneInner');
  const cards = filterInitCards(p);
  // reset P1 funnel state on re-entry
  if (pid === 1) p1FunnelState = { step: 0, cats: [], spendByCat: {} };
  renderPlacementSurface(p, cards, phone);
}

function renderPlacementSurface(p, cards, phone) {
  if (p.email)            return phone.innerHTML = renderEmailPreview(p, cards);
  if (p.id === 1)         return renderP1_Home(phone, cards);
  if (p.id === 2)         return renderP2_FDEntry(phone, cards);
  if (p.id === 3)         return renderP3_PostDisbursal(phone, cards);
  if (p.id === 4)         return renderP4_EMITracker(phone, cards);
  if (p.id === 6)         return renderP6_Trending(phone, cards);
  if (p.id === 7)         return renderP7_TailorMade(phone, cards);
  if (p.id === 8)         return renderP8_PlayWin(phone, cards);
  // fallback
  phone.innerHTML = `<div class="fi-header"><div class="fi-title">${escapeHtml(p.name)}</div></div><div class="fi-body">${cards.map(c => renderCardTile(c)).join('')}</div>${renderTabBar('home')}`;
}

// ── Fibe home chrome used by P1 and P6 ──────────────────────────────────────

function fibeStatusBar() {
  return `<div style="position:absolute;top:0;left:0;right:0;height:32px;display:flex;align-items:center;justify-content:space-between;padding:10px 18px 0;font-size:11px;font-weight:600;color:#191c1d;z-index:5"><span>11:53</span><span style="display:flex;gap:4px;align-items:center"><span class="material-symbols-outlined" style="font-size:12px">signal_cellular_alt</span><span class="material-symbols-outlined" style="font-size:12px">battery_6_bar</span><span>38%</span></span></div>`;
}

function fibeHeroGreeting() {
  // Fibe's confetti celebration top strip (Media 4/5)
  return `
    <div style="position:relative;padding:42px 16px 20px;background:linear-gradient(180deg,#fff5f0 0%,#fff 100%);overflow:hidden">
      <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 15% 40%,#fb7185 2px,transparent 2.5px),radial-gradient(circle at 85% 30%,#fbbf24 2px,transparent 2.5px),radial-gradient(circle at 30% 70%,#60a5fa 2.5px,transparent 3px),radial-gradient(circle at 70% 80%,#34d399 2px,transparent 2.5px);opacity:0.55;pointer-events:none"></div>
      <div style="position:relative;display:flex;justify-content:center">
        <div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:24px;padding:6px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);font-size:12px;font-weight:600;color:#191c1d">
          <span>Hi ! 👋</span>
          <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800">F</span>300</span>
          <span style="color:#64748b">|</span>
          <span style="display:inline-flex;align-items:center;gap:3px">💰 ₹0</span>
        </div>
      </div>
    </div>
  `;
}

function fibeTabBar(active) {
  const tabs = [
    { k:'home', label:'Home', icon:'home' },
    { k:'hub',  label:'Hub',  icon:'widgets' },
    { k:'my',   label:'My Fibe', icon:'chat_bubble' },
    { k:'fibo', label:'Fibo', icon:'pets' },
    { k:'more', label:'More', icon:'menu' },
  ];
  return `
    <div class="fi-tabbar" style="height:58px">
      ${tabs.map(t => `<div class="fi-tab ${t.k === active ? 'active' : ''}"><span class="material-symbols-outlined" style="font-size:20px">${t.icon}</span>${t.label}</div>`).join('')}
    </div>
  `;
}

// Back-compat helper (some older calls)
function renderTabBar(active) { return fibeTabBar(active || 'home'); }

// ── Credit-card-shaped tile used inside all placements ──────────────────────

function renderCardFace(c, opts = {}) {
  // Fibe's init bundle doesn't ship card-face images on this sandbox.
  // Render a credit-card-shaped rectangle with bank logo + card name overlay.
  const bankLogo = state.bankLogoMap[c.bankId];
  const grad = cardGradient(c);
  const size = opts.size || 'sm'; // sm (60×40) | md (110×68) | lg (150×95)
  const dims = { sm: [60, 40], md: [110, 68], lg: [150, 95] }[size];
  return `
    <div style="width:${dims[0]}px;height:${dims[1]}px;border-radius:8px;background:${grad};position:relative;overflow:hidden;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 20% 120%,rgba(255,255,255,0.15),transparent 50%),radial-gradient(circle at 110% -10%,rgba(255,255,255,0.2),transparent 60%)"></div>
      ${bankLogo ? `<img src="${bankLogo}" style="position:absolute;top:5px;left:6px;height:${size==='sm'?10:size==='md'?16:20}px;max-width:${size==='sm'?36:size==='md'?56:72}px;object-fit:contain;background:#fff;border-radius:2px;padding:1px 3px"/>` : ''}
      <div style="position:absolute;bottom:${size==='sm'?4:6}px;left:${size==='sm'?5:8}px;right:${size==='sm'?5:8}px;color:#fff;font-size:${size==='sm'?7:size==='md'?9:11}px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(c.name || '')}</div>
      ${size !== 'sm' ? `<div style="position:absolute;bottom:${size==='md'?22:28}px;left:${size==='md'?8:12}px;color:rgba(255,255,255,0.8);font-size:${size==='md'?9:11}px;letter-spacing:0.12em;font-family:monospace">•••• ${4000 + (c.bankId || 0)}</div>` : ''}
    </div>
  `;
}

function cardGradient(c) {
  // Deterministic per-bank gradient
  const palettes = [
    ['#7c3aed','#4f46e5'], ['#0891b2','#0e7490'], ['#be123c','#881337'],
    ['#c2410c','#9a3412'], ['#1e40af','#1e3a8a'], ['#047857','#065f46'],
    ['#a16207','#713f12'], ['#9d174d','#500724'], ['#0f766e','#134e4a'],
    ['#6b21a8','#3b0764'], ['#365314','#1a2e05'], ['#1f2937','#111827'],
  ];
  const i = (c.bankId || 0) % palettes.length;
  return `linear-gradient(135deg,${palettes[i][0]},${palettes[i][1]})`;
}

function renderCardTile(c, opts = {}) {
  // Fibe-style card row: card face on left, meta on right
  const feeText = c.isLTF
    ? `<span style="display:inline-block;font-size:9px;font-weight:800;color:#006767;background:#00676715;padding:2px 6px;border-radius:4px;letter-spacing:0.04em;text-transform:uppercase;margin-top:4px">Lifetime Free</span>`
    : `<div style="font-size:10px;color:#64748b;font-weight:500;margin-top:3px">Joining fee applicable of ₹${fmt(c.joiningFee)} ${c.annualFee > 0 ? '· ₹' + fmt(c.annualFee) + ' annual' : ''}</div>`;
  const category = cardCategory(c);
  return `
    <div style="display:flex;gap:14px;align-items:center;padding:14px 14px;background:#fff;border-radius:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
      ${renderCardFace(c, { size: 'md' })}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:14px;color:#191c1d;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(shortCardName(c.name))}</div>
        <div style="font-size:11px;color:#64748b;font-weight:500;margin-top:2px">${category}</div>
        ${feeText}
        ${opts.savings ? `<div style="font-size:11px;color:#006767;font-weight:700;margin-top:4px">Saves ₹${fmt(opts.savings)}/yr</div>` : ''}
      </div>
    </div>
  `;
}

function shortCardName(n) {
  if (!n) return '';
  return String(n).replace(/\s+Credit Card$/i, '').trim();
}

function cardCategory(c) {
  const txt = ((c.uspText || '') + ' ' + (c.name || '')).toLowerCase();
  if (/travel|airline|flight|lounge|miles/.test(txt)) return 'Travel';
  if (/fuel|iocl|hpcl|bpcl|indianoil/.test(txt)) return 'Fuel';
  if (/amazon|flipkart|online|shopping|cashback/.test(txt)) return 'Shopping';
  if (/dining|swiggy|zomato/.test(txt)) return 'Dining';
  if (/premium|reward|platinum|gold|elite|signature/.test(txt)) return 'Premium';
  if (/fd|secured|fixed deposit/.test(txt)) return 'Lifestyle';
  return 'Rewards';
}

// ── Placement 1: Trending-tile webview category funnel ──────────────────────

function renderP1_Home(phone, cards) {
  const step = p1FunnelState.step;
  if (step === 0) return renderP1_Step0_HomeTile(phone, cards);
  if (step === 1) return renderP1_Step1_Loader(phone, cards);
  if (step === 2) return renderP1_Step2_Categories(phone, cards);
  if (step === 3) return renderP1_Step3_Slider(phone, cards);
  if (step === 4) return renderP1_Step4_Cards(phone, cards);
}

function renderP1_Step0_HomeTile(phone, cards) {
  phone.innerHTML = renderFibeHomepage({ highlight: 'gc', showHelper: true });
  ensureStyle('p1PulseStyle', `
    @keyframes p1Pulse { 0%,100% { box-shadow:0 0 0 2px rgba(94,234,212,0.5); } 50% { box-shadow:0 0 0 4px rgba(94,234,212,0.95), 0 0 22px rgba(94,234,212,0.5); } }
    @keyframes p1GCFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-3px); } }
  `);
  document.getElementById('p1GCTile').addEventListener('click', () => {
    p1FunnelState.step = 1;
    renderP1_Step1_Loader(phone, filterInitCards(PLACEMENTS[0]));
    setTimeout(() => {
      if (p1FunnelState.step === 1) {
        p1FunnelState.step = 2;
        renderP1_Step2_Categories(phone, filterInitCards(PLACEMENTS[0]));
      }
    }, 1400);
  });
  // Credit Score tile on homepage deep-links into the P7 Tailor-made flow
  const csHand = document.getElementById('p1CreditScoreHandpick');
  const csHero = document.getElementById('p1CreditScoreHero');
  [csHand, csHero].forEach(el => {
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const p7 = PLACEMENTS.find(x => x.id === 7);
      renderP7_TailorMade(phone, filterInitCards(p7));
    });
  });
}

// ── Reusable Fibe homepage chrome (used by P1 Step 0 and P6) ────────────────
// Mirrors Media 8/9/10/11 fidelity: 10 YEARS hero + snap cards + Hand-picked
// for you + Fibe HUB + Trending + All Products + Lending Partners + Refer a Friend.
function renderFibeHomepage(opts = {}) {
  const highlightGC = opts.highlight === 'gc';
  const highlightCardOfWeek = opts.highlight === 'cardOfWeek';
  const cardOfWeek = opts.cardOfWeek || null;
  return `
    <div style="position:relative;height:100%;background:#F7F8FA;overflow:hidden;display:flex;flex-direction:column">
      ${fibeStatusBar()}
      <div style="flex:1;overflow-y:auto;padding-bottom:14px">
        <!-- Hero: 10 YEARS -->
        <div style="position:relative;padding:38px 16px 58px;background:linear-gradient(180deg,#fff5f0 0%,#fff 100%);overflow:hidden">
          <div style="position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle at 14% 58%,#fb7185 3px,transparent 3.5px),radial-gradient(circle at 88% 50%,#fbbf24 3px,transparent 3.5px),radial-gradient(circle at 30% 82%,#60a5fa 2.5px,transparent 3px),radial-gradient(circle at 70% 90%,#34d399 3px,transparent 3.5px),radial-gradient(circle at 50% 12%,#a78bfa 2.5px,transparent 3px);opacity:0.6"></div>
          <!-- Greeting pill -->
          <div style="position:relative;display:flex;justify-content:center;margin-bottom:10px">
            <div style="display:inline-flex;align-items:center;gap:10px;background:#fff;border-radius:24px;padding:6px 14px;box-shadow:0 2px 10px rgba(0,0,0,0.08);font-size:12px;font-weight:600;color:#191c1d">
              <span>Hi ! 👋</span>
              <span style="display:inline-flex;align-items:center;gap:4px"><span style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800">F</span>700</span>
              <span style="color:#e2e8f0">|</span>
              <span style="display:inline-flex;align-items:center;gap:3px">💰 ₹0</span>
              <span class="material-symbols-outlined" style="font-size:14px;color:#94a3b8">chevron_right</span>
            </div>
          </div>
          <!-- Celebration logo: gifts + 10 YEARS -->
          <div style="position:relative;display:flex;align-items:center;justify-content:center;gap:8px">
            <div style="font-size:32px;transform:rotate(-14deg)">🎁</div>
            <div style="text-align:center">
              <div style="font-size:54px;font-weight:900;letter-spacing:-0.04em;background:linear-gradient(90deg,#f472b6 0%,#fbbf24 35%,#34d399 65%,#60a5fa 100%);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:0.9">10<span style="font-size:18px;font-weight:800;letter-spacing:0.04em;margin-left:2px;color:#191c1d;-webkit-text-fill-color:#191c1d">YEARS</span></div>
              <div style="font-size:8.5px;font-weight:700;color:#64748b;letter-spacing:0.1em;margin-top:4px">OF MOVING DREAMS</div>
              <div style="font-size:8.5px;font-weight:800;color:#ec4899;letter-spacing:0.1em">TOWARDS REALITY</div>
            </div>
            <div style="font-size:28px;transform:rotate(14deg)">🎁</div>
          </div>
        </div>
        <!-- Snap-scroll: Instant Cash + Credit Score -->
        <div style="padding:0 16px;margin-top:-42px;position:relative">
          <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scroll-snap-type:x mandatory;margin:0 -4px;padding-left:4px">
            <div style="flex:0 0 78%;background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 6px 18px rgba(0,0,0,0.06);scroll-snap-align:start">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:800;color:#191c1d">Instant Cash</div>
                  <div style="font-size:9px;color:#64748b">by EarlySalary Services Private Limited</div>
                </div>
                <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#5eead4,#006767);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px">💸</div>
              </div>
              <div style="font-size:11px;color:#64748b">Get credit limit of up to</div>
              <div style="font-size:22px;font-weight:900;color:#191c1d;letter-spacing:-0.02em;margin:1px 0 12px">₹10,00,000</div>
              <!-- Progress -->
              <div style="display:flex;align-items:center;gap:4px;margin-bottom:6px">
                <div style="width:12px;height:12px;border-radius:50%;background:#006767;flex-shrink:0"></div>
                <div style="flex:1;height:2px;background:#006767"></div>
                <div style="width:10px;height:10px;border-radius:50%;border:2px solid #e7e8e9;flex-shrink:0"></div>
                <div style="flex:1;height:2px;background:#e7e8e9"></div>
                <div style="width:10px;height:10px;border-radius:50%;border:2px solid #e7e8e9;flex-shrink:0"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#64748b;margin-bottom:12px">
                <span style="font-weight:700;color:#191c1d">Personal<br/>details</span>
                <span>Know your<br/>limit</span>
                <span>Provide<br/>KYC</span>
              </div>
              <button style="width:100%;padding:11px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:12.5px;border:none">Complete application</button>
            </div>
            <div id="p1CreditScoreHero" style="flex:0 0 78%;background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 6px 18px rgba(0,0,0,0.06);scroll-snap-align:start">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <div style="font-size:14px;font-weight:800;color:#191c1d">Credit score</div>
                <div style="width:30px;height:30px">${fibeScoreGaugeSvg(30)}</div>
              </div>
              <div style="font-size:11px;color:#64748b">Your credit score is <b style="color:#006767">Excellent</b></div>
              <div style="font-size:28px;font-weight:900;color:#191c1d;letter-spacing:-0.02em;margin:1px 0 8px">809</div>
              <div style="height:4px;background:linear-gradient(90deg,#fca5a5,#fbbf24,#34d399);border-radius:2px;position:relative;margin-bottom:4px">
                <div style="position:absolute;right:12%;top:-5px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #006767"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#64748b;margin-bottom:10px"><span>300</span><span>900</span></div>
              <div style="text-align:center;font-size:9px;color:#94a3b8;margin-bottom:10px">Powered by <b style="color:#dc2626">EQUIFAX</b></div>
              <button style="width:100%;padding:10px;border-radius:10px;background:#fff;border:1px solid #006767;color:#006767;font-weight:700;font-size:12px">View detailed report</button>
            </div>
          </div>
        </div>
        <!-- Hand-picked for you -->
        <div style="padding:18px 16px 6px">
          <div style="font-size:14px;font-weight:800;color:#191c1d;margin-bottom:10px">Hand-picked for you!</div>
          <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:8px">
            <div style="background:linear-gradient(135deg,#5eead4,#006767);border-radius:14px;padding:12px;height:108px;position:relative;overflow:hidden;color:#fff">
              <div style="font-size:11px;font-weight:700;opacity:0.85">Fibe Intro</div>
              <div style="position:absolute;bottom:8px;left:12px;display:inline-flex;align-items:center;gap:4px;background:#fff;color:#006767;padding:4px 10px;border-radius:14px;font-size:10px;font-weight:700"><span class="material-symbols-outlined" style="font-size:12px">play_arrow</span>Watch now</div>
              <div style="position:absolute;right:8px;bottom:4px;width:62px;height:62px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:28px">👨‍💼</div>
            </div>
            <div id="p1CreditScoreHandpick" style="background:#fff;border-radius:14px;padding:10px;height:108px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,0.04);text-align:center">
              <div style="font-size:12px;font-weight:700;color:#191c1d">Credit score</div>
              <div>${fibeScoreGaugeSvg(44)}</div>
              <div style="font-size:11.5px;color:#006767;font-weight:700">Check now</div>
            </div>
          </div>
        </div>
        <!-- Fibe HUB pill -->
        <div style="padding:12px 16px 10px">
          <div style="background:#fff;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
            <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#f472b6,#ec4899);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px">🎁</div>
            <div style="flex:1;font-size:13.5px;font-weight:700;color:#191c1d">Fibe HUB</div>
            <span class="material-symbols-outlined" style="color:#94a3b8;font-size:20px">chevron_right</span>
          </div>
        </div>
        <!-- Trending -->
        <div style="padding:10px 0 4px 16px">
          <div style="font-size:14px;font-weight:800;color:#191c1d;margin-bottom:10px">Trending</div>
          <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;padding-right:16px">
            ${highlightCardOfWeek && cardOfWeek ? `
            <div style="flex:0 0 152px;height:178px;border-radius:14px;background:linear-gradient(160deg,#7c2d12,#9a3412);padding:12px;color:#fff;position:relative;overflow:hidden;box-shadow:0 0 0 2px rgba(251,191,36,0.55)">
              <div style="font-size:8px;font-weight:800;color:#fbbf24;letter-spacing:0.08em;margin-bottom:6px">⚡ CARD OF THE WEEK</div>
              ${renderCardFace(cardOfWeek, { size: 'md' })}
              <div style="margin-top:10px;font-size:12.5px;font-weight:800;line-height:1.15">${escapeHtml(shortCardName(cardOfWeek.name))}</div>
              <div style="font-size:10px;opacity:0.85;margin-top:2px;line-height:1.35">${cardOfWeek.isLTF ? 'Lifetime free · Apply in 90s' : '₹' + fmt(cardOfWeek.joiningFee) + ' joining · Apply now'}</div>
              <div style="position:absolute;bottom:10px;right:10px;display:inline-flex;align-items:center;gap:4px;background:#fbbf24;color:#7c2d12;padding:4px 9px;border-radius:12px;font-size:10px;font-weight:800">Apply <span class="material-symbols-outlined" style="font-size:12px">arrow_forward</span></div>
            </div>
            ` : ''}
            <div style="flex:0 0 152px;height:178px;border-radius:14px;background:linear-gradient(165deg,#0f4c81 0%,#1e3a8a 65%,#1d4ed8 100%);padding:12px;color:#fff;position:relative;overflow:hidden">
              <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(115deg,transparent 0 11px,rgba(255,255,255,0.08) 11px 12px);pointer-events:none"></div>
              <div style="position:relative;font-size:11px;font-weight:500;opacity:0.9">Shop Smart with</div>
              <div style="position:relative;font-size:18px;font-weight:900;color:#fbbf24;line-height:1.05;margin-top:2px">Vouchers</div>
              <div style="position:absolute;bottom:10px;left:12px;right:12px">
                <div style="width:58px;height:74px;border-radius:8px;background:linear-gradient(180deg,#fbbf24,#f59e0b);margin:0 auto 2px;position:relative;box-shadow:0 4px 12px rgba(0,0,0,0.25)">
                  <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:800;color:#7c2d12">VOUCHER</div>
                  <div style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:16px;height:16px;border-radius:50%;background:#ec4899;border:2px solid #fff"></div>
                </div>
              </div>
            </div>
            <div style="flex:0 0 152px;height:178px;border-radius:14px;background:linear-gradient(180deg,#1e40af 0%,#2563eb 55%,#3b82f6 100%);padding:12px;color:#fff;position:relative;overflow:hidden">
              <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,255,255,0.25),transparent 60%);pointer-events:none"></div>
              <div style="position:relative;text-align:center">
                <div style="font-size:12px;font-weight:700;margin-bottom:2px">↑ Fixed Deposits</div>
                <div style="font-size:9px;opacity:0.85">with returns</div>
                <div style="font-size:11px;font-weight:700">up to <b style="color:#fbbf24">9% p.a.</b></div>
              </div>
              <div style="position:absolute;bottom:8px;left:12px;right:12px;display:flex;align-items:flex-end;justify-content:center;gap:4px">
                <div style="width:32px;height:32px;border-radius:6px;background:#64748b;display:flex;align-items:center;justify-content:center;font-size:16px">🔒</div>
                <div style="width:20px;height:22px;border-radius:3px;background:#fbbf24;position:relative"><div style="position:absolute;inset:2px;border-radius:2px;background:linear-gradient(135deg,#b45309,#fbbf24)"></div></div>
              </div>
            </div>
            <div id="p1GCTile" style="flex:0 0 152px;height:178px;border-radius:14px;background:linear-gradient(160deg,#0e7490 0%,#006767 60%,#0a4d4d 100%);padding:12px;color:#fff;cursor:pointer;position:relative;overflow:hidden;${highlightGC ? 'box-shadow:0 0 0 2px rgba(94,234,212,0.7);animation:p1Pulse 2s ease-in-out infinite;' : ''}">
              <div style="font-size:10px;font-weight:700;color:#fbbf24;margin-bottom:6px;letter-spacing:0.04em">✨ POWERED BY GREAT.CARDS</div>
              <div style="font-size:14px;font-weight:900;line-height:1.15;margin-bottom:4px">Find your best<br/>credit card</div>
              <div style="font-size:10.5px;opacity:0.85;line-height:1.35">Pick spends.<br/>We match the card<br/>that saves you most.</div>
              <div style="position:absolute;bottom:10px;right:10px;width:26px;height:26px;border-radius:50%;background:#fbbf24;display:flex;align-items:center;justify-content:center;color:#0a4d4d"><span class="material-symbols-outlined" style="font-size:16px;font-weight:800">arrow_forward</span></div>
            </div>
            <div style="flex:0 0 152px;height:178px;border-radius:14px;background:linear-gradient(160deg,#0f766e,#134e4a);padding:12px;color:#fff;position:relative;overflow:hidden">
              <div style="font-size:13px;font-weight:800">Instant Health</div>
              <div style="font-size:10px;opacity:0.85;margin-top:2px">Care up to ₹5L</div>
            </div>
          </div>
        </div>
        <!-- All products -->
        <div style="padding:16px">
          <div style="font-size:14px;font-weight:800;color:#191c1d;margin-bottom:10px">All products</div>
          <div style="background:#fff;border-radius:14px;padding:14px 8px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px">
            ${[
              { label:'Instant Cash', sub:'by ESPL', icon:'💸', badge:null },
              { label:'Loan Against<br/>Mutual Fun…', sub:'by ESPL', icon:'📈', badge:null },
              { label:'Drive', sub:'by ESPL', icon:'🚗', badge:'New' },
              { label:'View More', sub:'', icon:'➜', badge:null, view:true },
            ].map(p => `
              <div style="text-align:center;padding:6px 4px;position:relative">
                <div style="width:44px;height:44px;border-radius:10px;background:${p.view?'#191c1d':'#fff5ea'};margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:22px;color:${p.view?'#fff':'inherit'};box-shadow:0 1px 2px rgba(0,0,0,0.06)">${p.view?'<span class="material-symbols-outlined" style="font-size:22px">expand_more</span>':p.icon}</div>
                ${p.badge ? `<div style="position:absolute;top:2px;left:50%;transform:translateX(0px);font-size:7px;font-weight:800;background:#ec4899;color:#fff;padding:1px 5px;border-radius:3px;letter-spacing:0.04em">${p.badge}</div>` : ''}
                <div style="font-size:10.5px;font-weight:700;color:#191c1d;line-height:1.2">${p.label}</div>
                ${p.sub ? `<div style="font-size:8.5px;color:#94a3b8;margin-top:1px">${p.sub}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        <!-- Fibe's Lending Partners row -->
        <div style="padding:0 16px 14px">
          <div style="background:#fff;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
            <span class="material-symbols-outlined" style="color:#006767">handshake</span>
            <div style="flex:1;font-size:12.5px;font-weight:700;color:#191c1d">Fibe's Lending Partners</div>
            <span class="material-symbols-outlined" style="color:#94a3b8;font-size:20px">chevron_right</span>
          </div>
        </div>
        <!-- Refer a friend -->
        <div style="padding:0 16px 18px">
          <div style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border-radius:14px;padding:16px;position:relative;overflow:hidden;min-height:130px">
            <div style="font-size:20px;font-weight:900;color:#ea580c;line-height:1.1">Refer A Friend</div>
            <div style="font-size:12px;color:#78350f;margin-top:4px;line-height:1.4">Welcome to the world<br/>of earnings</div>
            <button style="margin-top:14px;padding:9px 22px;background:#006767;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:12.5px">Refer now</button>
            <div style="position:absolute;right:8px;bottom:8px;width:72px;height:96px;display:flex;align-items:center;justify-content:center">
              <div style="position:relative;width:56px;height:86px;border-radius:9px;background:#fff;border:3px solid #ec4899;display:flex;align-items:center;justify-content:center">
                <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:flex;align-items:center;justify-content:center;font-size:18px">👩</div>
                <div style="position:absolute;top:-10px;left:-16px;font-size:18px;transform:rotate(-18deg)">💵</div>
                <div style="position:absolute;bottom:-6px;right:-14px;font-size:18px;transform:rotate(14deg)">💵</div>
              </div>
            </div>
          </div>
        </div>
        ${opts.showHelper ? '<div style="padding:0 16px 16px;text-align:center"><div style="display:inline-block;font-size:9px;font-weight:700;color:#7c3aed;background:#ede9fe;padding:3px 10px;border-radius:4px;letter-spacing:0.05em">TAP THE TEAL TILE IN TRENDING ↑</div></div>' : ''}
      </div>
      ${fibeTabBar('home')}
    </div>
  `;
}

// Inline credit-score arc gauge used in Credit Score tiles (Media 10).
function fibeScoreGaugeSvg(size) {
  const s = size || 40;
  return `
    <svg width="${s}" height="${s}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gg${s}" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#fca5a5"/>
          <stop offset="33%" stop-color="#fbbf24"/>
          <stop offset="66%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <path d="M 5 28 A 15 15 0 0 1 35 28" fill="none" stroke="url(#gg${s})" stroke-width="4" stroke-linecap="round"/>
      <circle cx="31" cy="22" r="2" fill="#006767"/>
    </svg>
  `;
}

function renderP1_Step1_Loader(phone) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#fff;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back" id="p1Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Great.Cards</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px">
        <div style="width:56px;height:56px;border:3px solid #e7e8e9;border-top-color:#006767;border-radius:50%;animation:spin 0.7s linear infinite;margin-bottom:20px"></div>
        <div style="font-size:15px;font-weight:700;color:#191c1d;margin-bottom:6px">Opening secure webview…</div>
        <div style="font-size:12px;color:#64748b;text-align:center;line-height:1.45">Zero PII passed. Only bucketed score and income band.</div>
        <div style="margin-top:24px;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;background:#F7F8FA;font-size:11px;color:#64748b"><span class="material-symbols-outlined" style="font-size:14px">lock</span> great.cards — verified partner</div>
      </div>
    </div>
  `;
  document.getElementById('p1Back').addEventListener('click', () => { p1FunnelState.step = 0; renderP1_Step0_HomeTile(phone); });
}

const CATEGORIES = [
  { k: 'online',   label: 'Online shopping', icon: '🛍️' },
  { k: 'fuel',     label: 'Fuel',           icon: '⛽' },
  { k: 'dining',   label: 'Dining out',     icon: '🍽️' },
  { k: 'travel',   label: 'Travel',         icon: '✈️' },
  { k: 'grocery',  label: 'Groceries',      icon: '🛒' },
  { k: 'bills',    label: 'Utility bills',  icon: '💡' },
  { k: 'ott',      label: 'OTT & gaming',   icon: '🎮' },
  { k: 'edu',      label: 'Education',      icon: '🎓' },
];

function renderP1_Step2_Categories(phone) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#fff;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back" id="p1Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Find your best card</div>
      </div>
      <div style="padding:18px 18px 12px;flex:1;overflow-y:auto">
        <div style="display:flex;gap:4px;margin-bottom:14px">
          <div style="flex:1;height:4px;background:#006767;border-radius:2px"></div>
          <div style="flex:1;height:4px;background:#e7e8e9;border-radius:2px"></div>
          <div style="flex:1;height:4px;background:#e7e8e9;border-radius:2px"></div>
        </div>
        <div style="font-size:17px;font-weight:800;color:#191c1d;line-height:1.3;margin-bottom:4px">What do you spend on?</div>
        <div style="font-size:12.5px;color:#64748b;margin-bottom:16px;line-height:1.45">Pick all that apply. We'll match you to the card that pays back the most.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="p1CatGrid">
          ${CATEGORIES.map(c => `
            <button data-cat="${c.k}" class="p1-cat ${p1FunnelState.cats.includes(c.k) ? 'active' : ''}" style="padding:12px 10px;border-radius:12px;border:1.5px solid #e7e8e9;background:#fff;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#191c1d;cursor:pointer;text-align:left">
              <span style="font-size:18px">${c.icon}</span>
              <span>${c.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div style="padding:12px 16px 16px;border-top:1px solid #e7e8e9;background:#fff">
        <button id="p1Next" style="width:100%;padding:14px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer;opacity:${p1FunnelState.cats.length ? '1' : '0.5'}">Next</button>
      </div>
    </div>
  `;
  ensureStyle('p1CatStyle', `.p1-cat.active { border-color:#006767 !important; background:#00676708 !important; box-shadow:inset 0 0 0 1px #006767; }`);
  document.getElementById('p1Back').addEventListener('click', () => { p1FunnelState.step = 0; renderP1_Step0_HomeTile(phone); });
  document.querySelectorAll('.p1-cat').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.cat;
      const i = p1FunnelState.cats.indexOf(k);
      if (i >= 0) p1FunnelState.cats.splice(i, 1); else p1FunnelState.cats.push(k);
      b.classList.toggle('active');
      document.getElementById('p1Next').style.opacity = p1FunnelState.cats.length ? '1' : '0.5';
    });
  });
  document.getElementById('p1Next').addEventListener('click', () => {
    if (!p1FunnelState.cats.length) return;
    p1FunnelState.step = 3;
    renderP1_Step3_Slider(phone);
  });
}

function renderP1_Step3_Slider(phone) {
  // Seed default spend for any newly-picked category that doesn't have a value yet.
  p1FunnelState.cats.forEach(k => {
    if (!(k in p1FunnelState.spendByCat)) {
      p1FunnelState.spendByCat[k] = (CATEGORY_META[k] || {}).defaultSpend || 5000;
    }
  });
  // Drop values for categories user de-selected.
  Object.keys(p1FunnelState.spendByCat).forEach(k => {
    if (!p1FunnelState.cats.includes(k)) delete p1FunnelState.spendByCat[k];
  });

  const catObjs = p1FunnelState.cats.map(k => {
    const c = CATEGORIES.find(x => x.k === k);
    const meta = CATEGORY_META[k] || { defaultSpend: 5000, rate: 0.02, q: 'How much do you spend each month?' };
    return { ...c, ...meta, spend: p1FunnelState.spendByCat[k] };
  });

  const total = () => catObjs.reduce((s, c) => s + (p1FunnelState.spendByCat[c.k] || 0), 0);
  const earn = () => Math.round(catObjs.reduce((s, c) => s + (p1FunnelState.spendByCat[c.k] || 0) * 12 * c.rate, 0));

  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#fff;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back" id="p1Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Find your best card</div>
      </div>
      <div style="padding:18px 18px 12px;flex:1;overflow-y:auto">
        <div style="display:flex;gap:4px;margin-bottom:14px">
          <div style="flex:1;height:4px;background:#006767;border-radius:2px"></div>
          <div style="flex:1;height:4px;background:#006767;border-radius:2px"></div>
          <div style="flex:1;height:4px;background:#e7e8e9;border-radius:2px"></div>
        </div>
        <div style="font-size:17px;font-weight:800;color:#191c1d;line-height:1.3;margin-bottom:4px">Your monthly spend</div>
        <div style="font-size:12.5px;color:#64748b;margin-bottom:18px;line-height:1.45">Set each category. We'll match the card that pays back the most on your actual mix.</div>

        ${catObjs.map(c => `
          <div style="margin-bottom:18px;padding:14px;background:#F7F8FA;border-radius:12px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:18px">${c.icon}</span>
              <span style="font-size:13px;font-weight:700;color:#191c1d">${c.q}</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px">
              <div style="font-size:22px;font-weight:800;color:#006767;letter-spacing:-0.01em">₹<span data-v="${c.k}">${fmt(c.spend)}</span></div>
              <div style="font-size:10px;color:#64748b;font-weight:500">per month</div>
            </div>
            <input type="range" data-cat="${c.k}" min="0" max="80000" step="500" value="${c.spend}" style="width:100%;accent-color:#006767"/>
            <div style="display:flex;justify-content:space-between;font-size:9.5px;color:#94a3b8;margin-top:2px"><span>₹0</span><span>₹80K</span></div>
          </div>
        `).join('')}

        <div style="margin-top:8px;padding:14px;background:linear-gradient(135deg,#00676710,#00828210);border:1px solid #00676725;border-radius:12px;font-size:12px;color:#334155;line-height:1.5">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#64748b;font-size:11px">Total monthly spend</span>
            <span style="font-weight:700;color:#191c1d">₹<span id="p1Total">${fmt(total())}</span></span>
          </div>
          <div style="border-top:1px dashed #00676735;padding-top:8px">
            <b style="color:#191c1d;font-size:11px">At this mix, the right card earns you up to</b>
            <div style="color:#006767;font-size:22px;font-weight:800;margin-top:2px">₹<span id="p1Earn">${fmt(earn())}</span>/yr</div>
            <div style="font-size:10.5px;color:#64748b;margin-top:2px">in cashback & rewards</div>
          </div>
        </div>
      </div>
      <div style="padding:12px 16px 16px;border-top:1px solid #e7e8e9;background:#fff">
        <button id="p1Next" style="width:100%;padding:14px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer">Find my cards</button>
      </div>
    </div>
  `;
  document.getElementById('p1Back').addEventListener('click', () => { p1FunnelState.step = 2; renderP1_Step2_Categories(phone); });
  phone.querySelectorAll('input[type="range"][data-cat]').forEach(sl => {
    sl.addEventListener('input', (e) => {
      const k = e.target.dataset.cat;
      const v = parseInt(e.target.value, 10);
      p1FunnelState.spendByCat[k] = v;
      const valEl = phone.querySelector(`[data-v="${k}"]`);
      if (valEl) valEl.textContent = fmt(v);
      document.getElementById('p1Total').textContent = fmt(total());
      document.getElementById('p1Earn').textContent = fmt(earn());
    });
  });
  document.getElementById('p1Next').addEventListener('click', () => {
    p1FunnelState.step = 4;
    renderP1_Step4_Cards(phone, filterInitCards(PLACEMENTS[0]));
  });
}

function renderP1_Step4_Cards(phone, cards) {
  const spendByCat = p1FunnelState.spendByCat || {};
  const totalSpend = Object.values(spendByCat).reduce((s, v) => s + v, 0);
  // Weighted savings: sum of (category spend × category rate), tier each card slightly lower than best
  const weighted = Object.keys(spendByCat).reduce(
    (s, k) => s + (spendByCat[k] || 0) * 12 * ((CATEGORY_META[k] || {}).rate || 0.02),
    0
  );
  const best = Math.round(weighted);
  const withSav = cards.slice(0, 3).map((c, i) => ({
    ...c,
    _sav: Math.round(best * (1 - i * 0.18)), // 100% / 82% / 64% of best
  }));
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back" id="p1Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Your matched cards</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px">
        <div style="font-size:15px;font-weight:800;color:#191c1d;margin-bottom:4px">${cards.length ? '3 cards tailored to your spend' : 'No cards matched'}</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:14px">Top pick first · based on ${p1FunnelState.cats.length} categor${p1FunnelState.cats.length > 1 ? 'ies' : 'y'} and ₹${fmt(totalSpend)}/mo total</div>
        ${withSav.length ? withSav.map((c, i) => `
          <div style="position:relative">
            ${i === 0 ? '<div style="position:absolute;top:-6px;left:10px;background:#006767;color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.04em;z-index:2">BEST MATCH</div>' : ''}
            ${renderCardTile(c, { savings: c._sav })}
          </div>
        `).join('') : '<div style="text-align:center;color:#64748b;padding:30px;font-size:13px">No cards match this profile — try a different score / income</div>'}
        <button id="p1Restart" style="width:100%;margin-top:6px;padding:10px;border-radius:8px;border:1px solid #e7e8e9;background:#fff;color:#64748b;font-size:12px;cursor:pointer">Start over</button>
      </div>
    </div>
  `;
  document.getElementById('p1Back').addEventListener('click', () => { p1FunnelState.step = 3; renderP1_Step3_Slider(phone); });
  document.getElementById('p1Restart').addEventListener('click', () => { p1FunnelState = { step: 0, cats: [], spendByCat: {} }; renderP1_Step0_HomeTile(phone, cards); });
}

// ── Placement 2: FD section entry → GC webview secured cards ────────────────

let p2State = { step: 0 };

function renderP2_FDEntry(phone, cards) {
  p2State.step = 0;
  _renderP2(phone, cards);
}
function _renderP2(phone, cards) {
  if (p2State.step === 0) {
    phone.innerHTML = `
      <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
        ${fibeStatusBar()}
        <div style="flex:1;overflow-y:auto;padding-top:40px">
          <div style="padding:0 16px;display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <span class="material-symbols-outlined" style="color:#006767">arrow_back</span>
            <div style="font-weight:700;font-size:15px;color:#191c1d">Fixed Deposits</div>
          </div>
          <div style="margin:0 16px;padding:16px;border-radius:14px;background:linear-gradient(135deg,#fef3c7,#fed7aa);margin-bottom:14px">
            <div style="font-size:11px;font-weight:600;color:#92400e;margin-bottom:4px">LOAN NOT APPROVED TODAY</div>
            <div style="font-size:13px;color:#7c2d12;line-height:1.45">You have ₹50,000 in Fibe FD. You can unlock a credit card against it — FD keeps earning, card gives credit.</div>
          </div>
          <div style="padding:0 16px;font-weight:700;font-size:14px;color:#191c1d;margin-bottom:10px">Unlock a card from your FD</div>
          <div id="p2FDTile" style="margin:0 16px;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#1e3a8a,#2563eb);padding:16px;color:#fff;cursor:pointer;position:relative">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:18px">🏦</div>
              <div>
                <div style="font-size:10px;opacity:0.85;font-weight:500">YOUR FD · ₹50,000 · EARNING 7.5%</div>
                <div style="font-size:15px;font-weight:800">FD-backed credit cards</div>
              </div>
            </div>
            <div style="font-size:12px;opacity:0.9;line-height:1.4;margin-bottom:10px">4 cards available · 1:1 credit line · zero joining fee · approval guaranteed</div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.2);padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700">See cards <span class="material-symbols-outlined" style="font-size:14px">arrow_forward</span></div>
            <div style="position:absolute;top:8px;right:8px;font-size:8px;font-weight:700;color:#fbbf24;background:rgba(0,0,0,0.25);padding:2px 7px;border-radius:3px;letter-spacing:0.05em">GREAT.CARDS</div>
          </div>
          <div style="padding:16px;font-size:11px;color:#94a3b8">Tap the tile to open the secure webview →</div>
        </div>
        ${fibeTabBar('home')}
      </div>
    `;
    document.getElementById('p2FDTile').addEventListener('click', () => { p2State.step = 1; _renderP2(phone, cards); });
  } else {
    // GC webview — Secured Credit Cards list (Media 7 style)
    phone.innerHTML = `
      <div style="position:relative;height:100%;background:#fff;display:flex;flex-direction:column">
        <div class="fi-header">
          <div class="fi-back" id="p2Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
          <div class="fi-title">Secured Credit Cards</div>
        </div>
        <div style="padding:16px 18px 6px">
          <div style="font-size:20px;font-weight:800;color:#191c1d;line-height:1.2">Fixed deposit backed<br/>credit cards for you!</div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:14px 16px 18px">
          ${cards.length ? cards.map(c => renderSecuredCardRow(c)).join('') : '<div style="text-align:center;color:#64748b;padding:30px;font-size:13px">No secured cards matched</div>'}
          <div style="font-size:10px;color:#94a3b8;margin-top:14px;text-align:center">Powered by Great.Cards</div>
        </div>
      </div>
    `;
    document.getElementById('p2Back').addEventListener('click', () => { p2State.step = 0; _renderP2(phone, cards); });
  }
}

function renderSecuredCardRow(c) {
  const fee = c.isLTF ? 'No joining fee applicable' : `Joining fee applicable of ₹${fmt(c.joiningFee)} + GST`;
  const category = cardCategory(c);
  return `
    <div style="display:flex;gap:14px;align-items:center;padding:16px 14px;background:#F7F8FA;border-radius:14px;margin-bottom:10px">
      ${renderCardFace(c, { size: 'lg' })}
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:15px;color:#191c1d;line-height:1.2;text-transform:uppercase;letter-spacing:0.02em">${escapeHtml(shortCardName(c.name))}</div>
        <div style="font-size:11px;color:#64748b;font-weight:500;margin-top:3px">${category}</div>
        <div style="font-size:11px;color:#334155;font-weight:500;margin-top:8px;line-height:1.4">${fee}</div>
      </div>
    </div>
  `;
}

// ── Placement 3: Post-disbursal confetti success ────────────────────────────

function renderP3_PostDisbursal(phone, cards) {
  const confettiFall = Array.from({length:26}, (_, i) => {
    const colors = ['#fb7185','#fbbf24','#60a5fa','#34d399','#a78bfa','#f472b6','#f59e0b'];
    const c = colors[i % colors.length];
    const left = (i * 3.85) % 100;
    const delay = (i * 0.18).toFixed(2);
    const dur = (3 + (i % 4) * 0.6).toFixed(2);
    const rot = Math.round((i * 37) % 360);
    const sq = i % 3 === 0;
    return `<span style="position:absolute;top:-18px;left:${left}%;width:${sq?7:5}px;height:${sq?7:10}px;background:${c};border-radius:${sq?'1px':'2px'};transform:rotate(${rot}deg);animation:p3Fall ${dur}s ${delay}s linear infinite;opacity:0.85"></span>`;
  }).join('');
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#fff;overflow:hidden;display:flex;flex-direction:column">
      <div style="position:relative;padding:50px 20px 28px;background:linear-gradient(180deg,#ecfdf5 0%,#fff 100%);overflow:hidden">
        <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${confettiFall}</div>
        <div style="position:relative;text-align:center">
          <div style="width:72px;height:72px;border-radius:50%;background:#10b981;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(16,185,129,0.3)">
            <span class="material-symbols-outlined" style="color:#fff;font-size:44px;font-weight:800">check</span>
          </div>
          <div style="font-size:14px;color:#64748b;font-weight:500;margin-bottom:4px">Loan disbursed successfully</div>
          <div style="font-size:32px;font-weight:800;color:#191c1d;line-height:1;margin-bottom:6px">₹1,50,000</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:12px">Credited to HDFC ••••4521 · 2 hrs ago</div>
          <div style="display:inline-block;background:#fff;border:1px solid #d1fae5;border-radius:20px;padding:5px 12px;font-size:11px;color:#065f46;font-weight:700">EMI 1 on 05 Jun · ₹13,450</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:6px 16px 16px;background:#F7F8FA">
        <div style="padding:14px 4px;text-align:center">
          <div style="font-size:11px;font-weight:700;color:#7c3aed;background:#ede9fe;display:inline-block;padding:3px 10px;border-radius:4px;margin-bottom:6px;letter-spacing:0.05em">WHILE YOU'RE HERE</div>
          <div style="font-size:15px;font-weight:800;color:#191c1d;line-height:1.3">Your EMIs can pay for themselves</div>
          <div style="font-size:12px;color:#64748b;margin-top:4px;line-height:1.45">2% cashback on UPI + offline spend via a credit card → offsets one full EMI every 5 months.</div>
        </div>
        ${cards.map((c, i) => `
          <div style="position:relative">
            ${i === 0 ? '<div style="position:absolute;top:-6px;left:10px;background:linear-gradient(90deg,#006767,#0e7490);color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;z-index:2;letter-spacing:0.04em">MATCHED TO YOUR EMI</div>' : ''}
            ${renderCardTile(c, { savings: i === 0 ? 18000 : 12500 })}
          </div>
        `).join('')}
        <button style="width:100%;padding:14px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:13px;border:none;margin-top:6px">See all matched cards →</button>
      </div>
    </div>
  `;
  ensureStyle('p3ConfettiStyle', `@keyframes p3Fall { 0% { transform:translateY(-20px) rotate(0deg); opacity:0; } 10% { opacity:0.9; } 90% { opacity:0.9; } 100% { transform:translateY(220px) rotate(720deg); opacity:0; } }`);
}

// ── Placement 4: EMI tracker ────────────────────────────────────────────────

function renderP4_EMITracker(phone, cards) {
  const emis = [
    { n: 1, date: '05 Jan',  status: 'paid' },
    { n: 2, date: '05 Feb',  status: 'paid' },
    { n: 3, date: '05 Mar',  status: 'paid' },
    { n: 4, date: '05 Apr',  status: 'paid' },
    { n: 5, date: '05 May',  status: 'due' },
    { n: 6, date: '05 Jun',  status: 'upcoming' },
    { n: 7, date: '05 Jul',  status: 'upcoming' },
    { n: 8, date: '05 Aug',  status: 'upcoming' },
  ];
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">EMI Schedule</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 14px 18px">
        <div style="background:linear-gradient(135deg,#006767,#0e7490);color:#fff;border-radius:14px;padding:16px;margin-bottom:14px">
          <div style="font-size:10px;font-weight:600;opacity:0.85;letter-spacing:0.04em">PERSONAL LOAN</div>
          <div style="font-size:22px;font-weight:800;margin:3px 0">₹1,50,000</div>
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-top:10px">
            <div><div style="opacity:0.75;font-size:10px">Tenure</div><div style="font-weight:700;margin-top:2px">12 months</div></div>
            <div><div style="opacity:0.75;font-size:10px">EMI</div><div style="font-weight:700;margin-top:2px">₹13,450</div></div>
            <div><div style="opacity:0.75;font-size:10px">Paid</div><div style="font-weight:700;margin-top:2px">4 / 12</div></div>
          </div>
          <div style="margin-top:12px;height:6px;background:rgba(255,255,255,0.2);border-radius:3px;overflow:hidden"><div style="width:33%;height:100%;background:#fff;border-radius:3px"></div></div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 6px rgba(0,0,0,0.04);margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#006767,#0e7490);display:flex;align-items:center;justify-content:center;font-size:16px">💳</span>
            <div>
              <div style="font-size:9px;font-weight:700;color:#006767;letter-spacing:0.05em">SMART MONEY MOVE</div>
              <div style="font-size:14px;font-weight:800;color:#191c1d;line-height:1.2">Your rewards can pay the next EMI</div>
            </div>
          </div>
          <div style="font-size:11.5px;color:#64748b;line-height:1.5;margin:6px 0 12px">Put your ₹40K/mo spend on a rewards card: 2.5% cashback = <b style="color:#191c1d">₹12,000/yr</b>. That's almost one full EMI, paid by rewards.</div>
          ${cards.slice(0,1).map(c => renderCardTile(c, { savings: 12000 })).join('')}
          <button style="width:100%;padding:12px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:13px;border:none;margin-top:4px">See matched cards</button>
        </div>
        <div style="background:#fff;border-radius:14px;padding:4px 4px 4px;margin-bottom:14px">
          <div style="padding:10px 12px 6px;font-size:12px;font-weight:700;color:#191c1d;letter-spacing:0.02em">Schedule</div>
          <div id="p4EmiList">
          ${emis.slice(0,4).map(e => {
            const color = e.status === 'paid' ? '#10b981' : e.status === 'due' ? '#f59e0b' : '#94a3b8';
            const bg = e.status === 'due' ? '#fffbeb' : '#fff';
            const icon = e.status === 'paid' ? 'check_circle' : e.status === 'due' ? 'schedule' : 'radio_button_unchecked';
            const label = e.status === 'paid' ? 'Paid' : e.status === 'due' ? 'Due in 12 days' : 'Upcoming';
            return `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:${bg};border-radius:8px;margin-bottom:2px">
                <span class="material-symbols-outlined" style="color:${color};font-size:22px">${icon}</span>
                <div style="flex:1">
                  <div style="font-size:12.5px;font-weight:700;color:#191c1d">EMI ${e.n} · ${e.date}</div>
                  <div style="font-size:10.5px;color:${color};font-weight:600;margin-top:1px">${label}</div>
                </div>
                <div style="font-size:13px;font-weight:700;color:#191c1d">₹13,450</div>
              </div>
            `;
          }).join('')}
          </div>
          <button id="p4ViewMore" style="width:100%;padding:10px;background:transparent;border:none;color:#006767;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px">View all 12 EMIs <span class="material-symbols-outlined" style="font-size:14px">expand_more</span></button>
        </div>
      </div>
    </div>
  `;
  const btn = document.getElementById('p4ViewMore');
  const list = document.getElementById('p4EmiList');
  let expanded = false;
  btn.addEventListener('click', () => {
    expanded = !expanded;
    list.innerHTML = (expanded ? emis : emis.slice(0,4)).map(e => {
      const color = e.status === 'paid' ? '#10b981' : e.status === 'due' ? '#f59e0b' : '#94a3b8';
      const bg = e.status === 'due' ? '#fffbeb' : '#fff';
      const icon = e.status === 'paid' ? 'check_circle' : e.status === 'due' ? 'schedule' : 'radio_button_unchecked';
      const label = e.status === 'paid' ? 'Paid' : e.status === 'due' ? 'Due in 12 days' : 'Upcoming';
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:${bg};border-radius:8px;margin-bottom:2px"><span class="material-symbols-outlined" style="color:${color};font-size:22px">${icon}</span><div style="flex:1"><div style="font-size:12.5px;font-weight:700;color:#191c1d">EMI ${e.n} · ${e.date}</div><div style="font-size:10.5px;color:${color};font-weight:600;margin-top:1px">${label}</div></div><div style="font-size:13px;font-weight:700;color:#191c1d">₹13,450</div></div>`;
    }).join('');
    btn.innerHTML = expanded
      ? 'Collapse <span class="material-symbols-outlined" style="font-size:14px">expand_less</span>'
      : 'View all 12 EMIs <span class="material-symbols-outlined" style="font-size:14px">expand_more</span>';
  });
}

// ── Placement 6: Trending row tile (featured card) ──────────────────────────

function renderP6_Trending(phone, cards) {
  const hero = cards[0];
  phone.innerHTML = renderFibeHomepage({ highlight: 'cardOfWeek', cardOfWeek: hero });
  // Clicking the Credit Score tile should also work here as P7 link
  const csHand = document.getElementById('p1CreditScoreHandpick');
  const csHero = document.getElementById('p1CreditScoreHero');
  [csHand, csHero].forEach(el => {
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      const p7 = PLACEMENTS.find(x => x.id === 7);
      renderP7_TailorMade(phone, filterInitCards(p7));
    });
  });
}

// ── Placement 7: Tailor-made offers (credit score page mid-scroll) ──────────

function renderP7_TailorMade(phone, cards) {
  const top = cards[0];
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Credit Score</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 16px 18px;background:linear-gradient(180deg,#fff5f0 0%,#fff 40%,#fff 100%)">
        <button style="width:100%;padding:13px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:13px;border:none;margin-bottom:10px">Check detailed report</button>
        <div style="text-align:center;font-size:11px;color:#64748b;margin-bottom:4px">New report in 45 days</div>
        <div style="text-align:center;font-size:11px;color:#64748b;margin-bottom:2px">Last updated on 23/04/2026</div>
        <div style="text-align:center;font-size:10px;color:#94a3b8;margin-bottom:14px">Powered by <b style="color:#dc2626">EQUIFAX</b></div>
        <div style="background:linear-gradient(90deg,#fef3c7,#fed7aa);border-radius:10px;padding:12px;font-size:12px;color:#78350f;text-align:center;line-height:1.45;margin-bottom:22px">Continue managing your credit wisely to<br/>maintain an excellent score</div>
        <div style="font-size:18px;font-weight:800;color:#191c1d;margin-bottom:14px">Tailor made offers for you!</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
          <div style="background:linear-gradient(180deg,#ede9fe,#fff);border-radius:14px;padding:12px;position:relative">
            <div style="display:inline-block;font-size:9px;background:#fff;color:#6d28d9;padding:2px 7px;border-radius:4px;font-weight:700;margin-bottom:10px">Lowest Interest Rate</div>
            <div style="height:56px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px">
              <div style="display:flex;gap:3px;align-items:flex-end"><div style="width:9px;height:20px;background:#a78bfa;border-radius:2px"></div><div style="width:9px;height:36px;background:#fbbf24;border-radius:2px"></div><div style="width:9px;height:28px;background:#fb923c;border-radius:2px"></div><div style="width:9px;height:44px;background:#f59e0b;border-radius:2px"></div></div>
            </div>
            <div style="font-size:13px;font-weight:800;color:#191c1d;line-height:1.2;margin-bottom:3px">Loan against mutual funds</div>
            <div style="font-size:10px;color:#64748b;margin-bottom:10px">Pay Interest Only</div>
            <button style="width:100%;padding:7px;border-radius:8px;border:1px solid #006767;background:transparent;color:#006767;font-size:11px;font-weight:700">Get Now</button>
          </div>
          <div id="p7GCTile" style="background:linear-gradient(180deg,#dbeafe,#fff);border-radius:14px;padding:12px;position:relative;box-shadow:0 0 0 2px rgba(94,234,212,0.6);cursor:pointer;animation:p7Pulse 2s ease-in-out infinite">
            <div style="display:inline-block;font-size:9px;background:#fff;color:#0e7490;padding:2px 7px;border-radius:4px;font-weight:700;margin-bottom:10px">Super offer</div>
            <div style="height:56px;display:flex;align-items:center;justify-content:center;margin-bottom:8px">
              <div style="position:relative;width:72px;height:48px">
                <div style="position:absolute;left:0;top:5px;width:40px;height:28px;border-radius:4px;background:linear-gradient(135deg,#6b21a8,#3b0764);transform:rotate(-8deg)"></div>
                <div style="position:absolute;left:10px;top:2px;width:40px;height:28px;border-radius:4px;background:linear-gradient(135deg,#be123c,#881337);transform:rotate(-2deg)"></div>
                <div style="position:absolute;left:20px;top:0;width:40px;height:28px;border-radius:4px;background:linear-gradient(135deg,#0891b2,#0e7490);transform:rotate(4deg)"></div>
                <div style="position:absolute;left:30px;top:3px;width:40px;height:28px;border-radius:4px;background:linear-gradient(135deg,#1e293b,#0f172a);transform:rotate(10deg)"></div>
              </div>
            </div>
            <div style="font-size:13px;font-weight:800;color:#191c1d;line-height:1.2;margin-bottom:3px">Credit cards that meet all your needs</div>
            <div style="font-size:10px;color:#64748b;margin-bottom:10px">Unlimited rewards | Cashbacks</div>
            <button style="width:100%;padding:7px;border-radius:8px;border:1px solid #006767;background:transparent;color:#006767;font-size:11px;font-weight:700">Apply now</button>
          </div>
        </div>
        <div style="font-size:15px;font-weight:800;color:#191c1d;margin-bottom:10px">Decode your credit score</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          ${['You Vs Best','Learn','Quiz'].map((l,i) => `
            <div style="background:#fff;border-radius:12px;padding:14px 6px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
              <div style="width:40px;height:40px;border-radius:50%;background:#F7F8FA;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:18px">${['📊','📖','❓'][i]}</div>
              ${i===0 ? '<div style="position:absolute;margin-top:-60px;margin-left:28px;font-size:8px;background:#ec4899;color:#fff;padding:1px 5px;border-radius:3px;font-weight:800">New</div>' : ''}
              <div style="font-size:10.5px;font-weight:600;color:#191c1d">${l}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  ensureStyle('p7PulseStyle', `@keyframes p7Pulse { 0%,100% { box-shadow:0 0 0 2px rgba(94,234,212,0.6); } 50% { box-shadow:0 0 0 4px rgba(94,234,212,1), 0 0 16px rgba(94,234,212,0.4); } }`);
  // wire the GC tile to expand into a full-page reco list
  document.getElementById('p7GCTile').addEventListener('click', () => renderP7_CardsList(phone, cards));
}

function renderP7_CardsList(phone, cards) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back" id="p7Back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Credit cards for you</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px">
        <div style="font-size:10px;font-weight:700;color:#7c3aed;background:#ede9fe;display:inline-block;padding:3px 9px;border-radius:4px;margin-bottom:8px;letter-spacing:0.04em">TAILOR MADE · SUPER OFFER</div>
        <div style="font-size:15px;font-weight:800;color:#191c1d;margin-bottom:4px">3 cards that meet your needs</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:14px">Unlimited rewards · Cashbacks · Zero-fee options</div>
        ${cards.slice(0,3).map((c,i) => `
          <div style="position:relative">
            ${i === 0 ? '<div style="position:absolute;top:-6px;left:10px;background:#006767;color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;z-index:2;letter-spacing:0.04em">TOP PICK</div>' : ''}
            ${renderCardTile(c, { savings: [22000,16500,11000][i] })}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('p7Back').addEventListener('click', () => renderP7_TailorMade(phone, cards));
}

// ── Placement 8: Play & Win ─────────────────────────────────────────────────

let p8State = { step: 'arcade' };

function renderP8_PlayWin(phone, cards) {
  p8State.step = 'arcade';
  _renderP8(phone, cards);
}
function _renderP8(phone, cards) {
  if (p8State.step === 'arcade') {
    phone.innerHTML = `
      <div style="position:relative;height:100%;background:#0f0d1a;overflow:hidden;display:flex;flex-direction:column">
        ${fibeStatusBar()}
        <div style="flex:1;overflow-y:auto;padding:40px 16px 12px;color:#fff">
          <div style="font-size:15px;font-weight:700;margin-bottom:10px">Rewards</div>
          <div style="background:linear-gradient(135deg,#7c4f1b,#3b2508);border:1px solid rgba(251,191,36,0.4);border-radius:14px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:18px">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:flex;align-items:center;justify-content:center;color:#7c2d12;font-weight:800">F</div>
            <div style="flex:1">
              <div style="font-size:18px;font-weight:800">700</div>
              <div style="font-size:11px;opacity:0.75">Spend more to earn more</div>
              <div style="font-size:11px;font-weight:700;color:#fbbf24;margin-top:2px;text-decoration:underline">View Details</div>
            </div>
            <div style="font-size:36px">🪙</div>
          </div>
          <div style="position:relative;background:#1a0f2e;border:2px solid #ff4fa3;border-radius:16px;padding:14px 10px;overflow:hidden">
            <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 20% 30%,rgba(255,79,163,0.15),transparent 50%),radial-gradient(circle at 80% 70%,rgba(139,92,246,0.2),transparent 50%);pointer-events:none"></div>
            <div style="position:relative;text-align:center">
              <div style="background:#fff;display:inline-block;padding:4px 22px;font-weight:900;color:#0f0d1a;font-size:16px;border-radius:3px;letter-spacing:0.05em;margin-bottom:10px">PLAY & WIN</div>
              <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px">
                <span style="color:#ff4fa3;font-size:28px;animation:p8Arrow 1.2s ease-in-out infinite">◀</span>
                <div style="width:180px;height:90px;border-radius:8px;background:linear-gradient(135deg,#ff8c00,#ff4500);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
                  <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 20% 30%,#ffd700 8px,transparent 9px),radial-gradient(circle at 75% 65%,#ff1493 6px,transparent 7px),radial-gradient(circle at 85% 20%,#00ff7f 5px,transparent 6px)"></div>
                  <div style="position:relative;font-weight:900;color:#fff;font-size:22px;letter-spacing:-0.02em;text-shadow:0 2px 0 #7c2d12;transform:rotate(-3deg)">SLASH<span style="font-size:10px;background:#fff;color:#ff4500;padding:1px 4px;margin:0 2px;border-radius:2px;vertical-align:middle">THE</span>FRUITS</div>
                </div>
                <span style="color:#ff4fa3;font-size:28px;animation:p8Arrow 1.2s ease-in-out infinite reverse">▶</span>
              </div>
              <div style="font-size:11px;color:#fbbf24;margin-bottom:10px;display:inline-flex;align-items:center;gap:4px">💰 Use 100 FibeCoins to play and win</div>
              <button id="p8Start" style="display:block;margin:0 auto;padding:10px 34px;background:#fff;color:#0f0d1a;font-weight:900;border:none;border-radius:4px;font-size:14px;letter-spacing:0.05em;cursor:pointer;animation:p8StartPulse 1.6s ease-in-out infinite">START</button>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px;margin-bottom:8px">
            <div style="font-size:13px;font-weight:700">More games</div>
            <div style="font-size:10px;opacity:0.6;font-weight:500">Dropping soon</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <div style="position:relative;height:94px;background:linear-gradient(160deg,#fbbf24,#f59e0b);border-radius:12px;overflow:hidden;padding:10px;color:#3b2508">
              <div style="font-size:28px;line-height:1">🎯</div>
              <div style="font-size:11px;font-weight:800;margin-top:6px;line-height:1.15">Spin &amp; Win</div>
              <div style="position:absolute;bottom:6px;left:10px;font-size:8px;font-weight:700;background:rgba(0,0,0,0.2);color:#fff;padding:2px 6px;border-radius:3px;letter-spacing:0.04em">SOON</div>
            </div>
            <div style="position:relative;height:94px;background:linear-gradient(160deg,#ec4899,#db2777);border-radius:12px;overflow:hidden;padding:10px;color:#fff">
              <div style="font-size:28px;line-height:1">🎲</div>
              <div style="font-size:11px;font-weight:800;margin-top:6px;line-height:1.15">Ludo Blitz</div>
              <div style="position:absolute;bottom:6px;left:10px;font-size:8px;font-weight:700;background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px;letter-spacing:0.04em">SOON</div>
            </div>
            <div style="position:relative;height:94px;background:linear-gradient(160deg,#8b5cf6,#6d28d9);border-radius:12px;overflow:hidden;padding:10px;color:#fff">
              <div style="font-size:28px;line-height:1">🏏</div>
              <div style="font-size:11px;font-weight:800;margin-top:6px;line-height:1.15">Cricket XI</div>
              <div style="position:absolute;bottom:6px;left:10px;font-size:8px;font-weight:700;background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:3px;letter-spacing:0.04em">SOON</div>
            </div>
          </div>
        </div>
        ${fibeTabBar('home')}
      </div>
    `;
    ensureStyle('p8Style', `
      @keyframes p8Arrow { 0%,100% { transform:translateX(0); opacity:1; } 50% { transform:translateX(-4px); opacity:0.6; } }
      @keyframes p8StartPulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(255,255,255,0.7); } 50% { transform:scale(1.04); box-shadow:0 0 0 8px rgba(255,255,255,0); } }
      @keyframes p8Win { 0% { transform:scale(0.5); opacity:0; } 50% { transform:scale(1.15); } 100% { transform:scale(1); opacity:1; } }
      @keyframes p8ConfettiBurst { 0% { transform:translate(-50%,-50%) scale(0); opacity:1; } 100% { transform:translate(var(--x,0),var(--y,0)) scale(1); opacity:0; } }
    `);
    document.getElementById('p8Start').addEventListener('click', () => { p8State.step = 'win'; _renderP8(phone, cards); });
  } else {
    // Win state with confetti + LTF card unlock
    phone.innerHTML = `
      <div style="position:relative;height:100%;background:#0f0d1a;overflow:hidden;display:flex;flex-direction:column">
        ${fibeStatusBar()}
        <div style="flex:1;overflow-y:auto;padding:50px 16px 12px;color:#fff;text-align:center;position:relative">
          <div id="p8Confetti" style="position:absolute;inset:0;pointer-events:none"></div>
          <div style="font-size:64px;margin-bottom:4px;animation:p8Win 0.6s ease-out">🎉</div>
          <div style="font-size:26px;font-weight:900;background:linear-gradient(90deg,#fbbf24,#ec4899,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:6px">You won!</div>
          <div style="font-size:13px;opacity:0.8;margin-bottom:24px">3 wins in a row — pick your lifetime free card</div>
          <div style="text-align:left;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:12px;margin-bottom:14px">
            <div style="font-size:10px;font-weight:700;color:#fbbf24;letter-spacing:0.05em;margin-bottom:8px">PICK 1 OF ${Math.min(cards.length,3)} UNLOCKED CARDS</div>
            ${cards.slice(0,3).map((c,i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:10px 8px;background:rgba(255,255,255,0.03);border-radius:10px;margin-bottom:6px;border:1px solid rgba(255,255,255,0.06)">
                ${renderCardFace(c, { size: 'sm' })}
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(shortCardName(c.name))}</div>
                  <div style="font-size:10px;color:#fbbf24;font-weight:700;margin-top:1px">LIFETIME FREE · UNLOCKED</div>
                </div>
                <span class="material-symbols-outlined" style="color:#fbbf24;font-size:18px">arrow_forward</span>
              </div>
            `).join('')}
          </div>
          <button id="p8Again" style="padding:8px 20px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);font-size:11px;border-radius:6px">Play again</button>
        </div>
        ${fibeTabBar('home')}
      </div>
    `;
    // confetti burst
    const conf = document.getElementById('p8Confetti');
    if (conf) {
      const colors = ['#fbbf24','#ec4899','#a78bfa','#34d399','#60a5fa'];
      for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;top:15%;left:50%;width:8px;height:12px;background:${colors[i%5]};border-radius:2px;--x:${(Math.random()-0.5)*340}px;--y:${Math.random()*480}px;animation:p8ConfettiBurst 1.4s ease-out ${i*20}ms forwards`;
        conf.appendChild(p);
      }
    }
    document.getElementById('p8Again').addEventListener('click', () => { p8State.step = 'arcade'; _renderP8(phone, cards); });
  }
}

// ── Email preview (P5) ──────────────────────────────────────────────────────

function renderEmailPreview(p, cards) {
  return `
    <div style="position:relative;height:100%;background:#fff;display:flex;flex-direction:column;font-family:'Roboto','Google Sans',Arial,sans-serif">
      <!-- Gmail top bar -->
      <div style="padding:38px 14px 10px;background:#fff;border-bottom:1px solid #f1f3f4;display:flex;align-items:center;gap:8px">
        <span class="material-symbols-outlined" style="color:#5f6368;font-size:22px">arrow_back</span>
        <div style="flex:1;display:flex;gap:18px;color:#5f6368;font-size:18px">
          <span class="material-symbols-outlined">archive</span>
          <span class="material-symbols-outlined">delete</span>
          <span class="material-symbols-outlined">mail</span>
          <span class="material-symbols-outlined">more_vert</span>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto">
        <!-- Subject row -->
        <div style="padding:16px 18px 10px">
          <div style="font-size:20px;font-weight:400;color:#202124;line-height:1.3;margin-bottom:10px">Your loan is sanctioned — 2 cards pair best with it</div>
          <div style="display:inline-flex;align-items:center;gap:6px;border:1px solid #dadce0;background:#fff;border-radius:4px;padding:3px 10px 3px 8px;font-size:11px;color:#5f6368">
            <span class="material-symbols-outlined" style="font-size:14px;color:#c5221f">label</span> Primary
          </div>
        </div>
        <!-- Sender row -->
        <div style="padding:0 18px 12px;display:flex;gap:12px;align-items:flex-start;border-bottom:1px solid #f1f3f4;padding-bottom:14px">
          <div style="width:40px;height:40px;border-radius:50%;background:#006767;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">F</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:baseline;gap:6px">
              <span style="font-size:14px;font-weight:600;color:#202124">Team Fibe</span>
              <span style="font-size:12px;color:#5f6368">&lt;loans@fibe.in&gt;</span>
            </div>
            <div style="font-size:12px;color:#5f6368;margin-top:1px;display:flex;align-items:center;gap:4px">to me <span class="material-symbols-outlined" style="font-size:14px">expand_more</span></div>
          </div>
          <div style="font-size:11px;color:#5f6368;flex-shrink:0;text-align:right;margin-top:2px">
            just now
            <div style="display:flex;gap:10px;margin-top:3px;justify-content:flex-end;color:#5f6368"><span class="material-symbols-outlined" style="font-size:18px">star_border</span><span class="material-symbols-outlined" style="font-size:18px">reply</span></div>
          </div>
        </div>
        <!-- Email body -->
        <div style="padding:16px 18px 18px;font-size:14px;color:#202124;line-height:1.55">
          <p style="margin:0 0 12px">Hi,</p>
          <p style="margin:0 0 12px">Your ₹1,50,000 personal loan is <b>sanctioned</b>. Disbursal hits your bank in 2 hours.</p>
          <p style="margin:0 0 14px">Based on your income band and spending profile, these two cards save you the most every month — both are lifetime free, 90-second approval.</p>
          <div style="background:#F7F8FA;border-radius:10px;padding:10px 10px 2px;margin:12px 0">
            ${cards.map((c, i) => renderCardTile(c, { savings: [22000, 14500][i] || null })).join('')}
          </div>
          <a style="display:inline-block;background:#006767;color:#fff;font-size:13px;font-weight:500;padding:10px 22px;border-radius:4px;text-decoration:none;margin:6px 0 14px">Open in Fibe app</a>
          <p style="margin:0 0 4px;font-size:12.5px;color:#5f6368">— Team Fibe</p>
          <p style="margin:0;font-size:11px;color:#80868b">Powered by Great.Cards · You're receiving this because you applied for a personal loan.</p>
        </div>
        <!-- Reply actions -->
        <div style="padding:4px 18px 18px;display:flex;gap:8px">
          ${['Reply','Reply all','Forward'].map(a => `<button style="flex:1;padding:8px;background:#fff;border:1px solid #dadce0;border-radius:18px;color:#202124;font-size:13px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:6px"><span class="material-symbols-outlined" style="font-size:16px">${a==='Reply'?'reply':a==='Reply all'?'reply_all':'forward'}</span>${a}</button>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Utility ─────────────────────────────────────────────────────────────────

function ensureStyle(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── Tab 2: Notification Simulator ──────────────────────────────────────────
// Core rules (see docs/05-NOTIFICATIONS-COPY.md for full spec):
// 1. Never pitch a Fibe product INSIDE a card message. Loan moment is context, not cross-sell.
// 2. Always name the card. "A credit card" is dead. "HDFC Millennia" converts.
// 3. One ₹ number per push. Pick the highest one.
// 4. Push = 2 sentences max. Single card, single ₹, single CTA.
// 5. No email before Day 3. Anything faster reads as automated.
// 6. Never promise pre-approval unless issuer API confirms it explicitly.
// 7. Global cap: 6 msgs / 7 days. Daily cap: 1 push + 1 email / day. C4 full sequence
//    exempt from 7-day cap; C4 D1 +2hrs exempt from daily cap too.
// Fallback: every [bracketed] variable has a default card. Null → default. Ineligible →
// next-best. Nothing eligible → suppress. Never ship a literal bracket.

const COHORTS = [
  {
    id: 1, name: 'Registered, no PAN',
    persona: 'Just signed up. Card-curious. PAN not uploaded.',
    cap: '7 messages over 30 days — card-as-hero, PAN is mechanic',
    messages: [
      { day: 1, time: '10:00 AM', type: 'push', hook: 'H3', title: 'Your 3 cards are ready',
        body: 'Axis Ace · HDFC MoneyBack+ · SBI SimplyClick. All lifetime free. 90 seconds to claim.',
        cta: 'Claim my 3',
        why: 'Card as hero, PAN as mechanic. Three named cards = trust, not three banks.' },
      { day: 2, time: '11:00 AM', type: 'push', hook: 'H3', title: 'HDFC MoneyBack+ · 5% on Amazon & Flipkart',
        body: 'LTF. ₹500 welcome bonus on first ₹1,000. Your online spend pays for itself.',
        cta: 'See card',
        why: 'Category-specific. Shifts from "a card" to "your card." Card-as-hero intact.' },
      { day: 4, time: '8:00 PM', type: 'email', hook: 'H3', subject: '5 credit cards you qualify for — here\'s why each matches',
        preheader: 'Lifetime free. Personalised. 2-minute apply.',
        body: `Hey,\n\nBased on your profile (salaried, income band declared at signup), here are 5 cards you qualify for — all with the lowest friction:\n\n1. Axis Ace — LTF, 2% cashback on bills + rides\n2. HDFC MoneyBack+ — LTF, 5% on Amazon & Flipkart\n3. SBI SimplyClick — LTF, 10× rewards on online spends\n4. ICICI Platinum Chip — LTF, PAYBACK points on every spend\n5. Kotak League Platinum — LTF, 4× rewards on dining\n\nAll zero joining fee. All zero annual fee. All lifetime free.\n\n90 seconds to verify PAN, 2 minutes to apply. Bank approval in 3 working days.`,
        cta: 'Claim my 5',
        why: 'Email = space for full shortlist. Named cards. Card-first, Fibe incidental. D4 = post-72hr (no email before D3 rule).' },
      { day: 7, time: '6:00 PM', type: 'push', hook: 'H3', title: 'Aarav in Malad just got Axis Ace',
        body: 'Lifetime free. ₹500 back on first spend. 90 seconds.',
        cta: 'See matching cards',
        why: 'Social proof via fictional-but-plausible neighbour. Mumbai-coded.' },
      { day: 10, time: '10:00 AM', type: 'push', hook: 'H3', title: 'SBI SimplyClick ₹2,000 sign-on — ends this month',
        body: 'Bank-funded voucher. LTF. Real campaign, not a teaser.',
        cta: 'Apply before it ends',
        why: 'Bank-funded scarcity. Real campaign, so the urgency is honest.' },
      { day: 22, time: '7:00 PM', type: 'email', hook: 'H5', subject: '6 cards hand-picked for your spend — save up to ₹18,400/yr',
        preheader: 'Personalised math, not marketing.',
        body: `Here's the full shortlist for your income band and declared spend categories:\n\nHDFC IndianOil — if fuel ≥ ₹8K/mo → ₹18,400 saved/yr\nAmazon Pay ICICI — if Amazon ≥ ₹15K/mo → ₹12,000 back/yr\nAxis Ace — bills + rides → ₹7,200 back/yr\nHDFC MoneyBack+ — general online → ₹8,500 back/yr\nSBI Cashback — 5% on all online → ₹15,000 back/yr\nKotak League — dining ≥ ₹5K → ₹6,500 back/yr\n\nAll LTF (zero joining, zero annual). Tap any card → apply in 2 minutes.`,
        cta: 'See all 6',
        why: 'Specific ₹ outcomes per card = conviction. Math beats promises.' },
      { day: 30, time: '9:00 AM', type: 'email', hook: 'H3', subject: 'Still looking? 3 LTF cards · 2 minutes · nothing to lose',
        preheader: 'Zero fees. Pre-matched.',
        body: `Axis Ace, HDFC MoneyBack+, SBI SimplyClick.\n\nAll three: lifetime free. All three: no annual fee ever. All three: you qualify.\n\nVerify PAN (90 sec) → pick one → bank approval in 3 days.\n\nNo pitch. Just the three we'd pick for someone with your profile.`,
        cta: 'Pick 1 of 3',
        why: 'Day 30 final close — three concrete names, no abstraction. LTF = lowest-friction.' },
    ],
  },
  {
    id: 2, name: 'Registered + PAN, no loan, no card',
    persona: 'PAN verified. High intent, no action yet.',
    cap: '9 messages over 30 days — spend-matched from Day 1',
    messages: [
      { day: 1, time: '9:00 AM', type: 'push', hook: 'H5', title: 'PAN verified ✓ — your top spend card is ready',
        body: '[Spend-matched card] · [₹ savings/yr]. Pre-matched to your declared category. Fallback: HDFC MoneyBack+ · ₹12,000/yr.',
        cta: 'See my card',
        why: 'PAN-verified = earn the personalization moment. Fallback if pipeline null or ineligible: HDFC MoneyBack+ (broadest spend match).' },
      { day: 2, time: '11:00 AM', type: 'push', hook: 'H5', title: 'Save ₹18,400 on fuel this year',
        body: 'HDFC IndianOil card — 5% on fuel, 5% on groceries. Profile-matched.',
        cta: 'See the card',
        why: 'Specific ₹, specific card. Spend-based reco via /calculate data.' },
      { day: 3, time: '6:00 PM', type: 'push', hook: 'H5', title: 'Your online spend × 5% = ₹12,000/yr',
        body: 'Amazon Pay ICICI card — 5% on Amazon. LTF for Prime members.',
        cta: 'See card',
        why: 'Different category, different hero card. Keeps the reco catalog wide.' },
      { day: 5, time: '10:00 AM', type: 'push', hook: 'H3', title: 'SBI Cashback Credit Card — 5% on ALL online spends',
        body: 'No category caps. ₹2,000 monthly cap. Bills, shopping, OTT — all 5% back.',
        cta: 'Apply',
        why: 'Specific card, specific USP. "All online" removes the category-pick cognitive load.' },
      { day: 7, time: '8:00 PM', type: 'email', hook: 'H5', subject: 'One card. ₹25,000 back a year. Here\'s the math.',
        preheader: 'Personalised to how you actually spend.',
        body: `Based on your declared spend pattern:\n\nAmazon ₹10K/mo × 5% = ₹6,000/yr\nFuel ₹5K/mo × 5% = ₹3,000/yr\nBills ₹5K/mo × 2% = ₹1,200/yr\nGroceries ₹8K/mo × 3% = ₹2,880/yr\nDining ₹4K/mo × 5% = ₹2,400/yr\nOther online ₹5K/mo × 2% = ₹1,200/yr\n\n= ₹16,680/yr cashback.\n\nAdd sign-up bonus (₹2,000) + annual fee waiver (₹999) = ₹19,679/yr net benefit.\n\nSBI Cashback Credit Card. Joining fee ₹999, waived on ₹2L annual spend (you'll hit that).`,
        cta: 'Apply to SBI Cashback',
        why: 'Math beats promise. Specific ₹ per category = credibility. Addresses the joining fee head-on.' },
      { day: 10, time: '11:00 AM', type: 'push', hook: 'H11', title: '1,00,000 reward points in month 1',
        body: 'HDFC Regalia Gold — spend ₹50K, get ₹25K in flights & hotels. Salaried at ₹60K+? Eligible.',
        cta: 'See card',
        why: 'Premium card push. Big numbers break banner fatigue.' },
      { day: 14, time: '10:00 AM', type: 'push', hook: 'H3', title: '3 lifetime free cards, picked for you',
        body: 'Zero joining. Zero annual. 2-minute apply. Approval in 3 days.',
        cta: 'See all 3',
        why: 'LTF reminder. Frictionless close.' },
      { day: 21, time: '11:30 AM', type: 'push', hook: 'H10', title: '0% EMI on 10K+ merchants',
        body: 'Axis Ace + Bajaj EMI network = zero interest on phones, electronics, insurance.',
        cta: 'See cards with 0% EMI',
        why: 'EMI-mindset user — reframe card as cheaper financing than a loan.' },
      { day: 30, time: '11:00 AM', type: 'push', hook: 'H5', title: 'Your top-savings card — based on 30 days in the app',
        body: '[Highest-saving card for your profile] saves you [₹X]/yr. Fallback: SBI Cashback · ₹15K/yr.',
        cta: 'See card',
        why: 'Data-personalisation close. Fallback ensures no bracketed message ever ships.' },
    ],
  },
  {
    id: 3, name: 'In-Journey (loan pending)',
    persona: 'Loan applied. Decision pending.',
    cap: 'ZERO · non-negotiable',
    messages: [],
    silent: true,
    silentReason: 'Breaking silence at loan decision moment destroys trust and cross-product funnel. Zero card messaging.',
  },
  {
    id: 4, name: 'Approved + loan taken',
    persona: 'Disbursal complete. Highest emotion. Peak wallet-share.',
    cap: '8 messages / 30 days · full sequence exempt from 7-day cap · D1 +2hrs exempt from daily cap',
    messages: [
      { day: 1, time: '2hr post-disbursal', type: 'push', hook: 'H1', title: '₹1,50,000 credited ✓ One more thing —',
        body: 'Swipe ₹10K in 30 days — we pay your next EMI. Up to ₹1,500.',
        cta: 'Claim the card',
        why: 'Priority #1 in the system. ₹1,500 absorbed from card issuance commission — self-funding unit model. 2-hr delay = money has landed.' },
      { day: 2, time: '10:00 AM', type: 'push', hook: 'H1', title: 'HDFC Millennia — the card behind your EMI offer',
        body: '2.5% cashback on Amazon, Swiggy, Zomato. ₹10K spend → ₹1,500 EMI credit.',
        cta: 'See card',
        why: 'Name the actual card. H1 promise is abstract unless the card is concrete.' },
      { day: 3, time: '11:00 AM', type: 'push', hook: 'H10', title: '0% EMI on your next phone',
        body: 'HDFC card = 0% interest on 10K+ partner merchants. Stop paying 3× on the next big purchase.',
        cta: 'See cards',
        why: 'H10. Reframes card as smarter financing than a loan for their NEXT need.' },
      { day: 5, time: '8:00 PM', type: 'push', hook: 'H11', title: 'HDFC Regalia Gold · 1L points on ₹50K spend',
        body: '₹25,000 in flights + hotels. Your income qualifies.',
        cta: 'Apply',
        why: 'H11 premium signup bonus. Approved-active cohort has income validated.' },
      { day: 7, time: '8:00 PM', type: 'email', hook: 'H11', subject: '1 lakh points in month 1 — real math',
        preheader: 'Spend ₹50K, earn ₹25K worth of rewards. Not marketing.',
        body: `HDFC Regalia Gold signup bonus breakdown:\n\nBase bonus: 2,500 reward points (worth ₹500 on flights)\nSpend milestone: ₹50K in 30 days → 5,000 bonus points\nCategory multiplier: 4× on travel, dining → 92,500 extra points\n\nTotal: ~1,00,000 reward points on ₹50K spend.\nRedemption value at 1 point = ₹0.25 on travel = ₹25,000.\n\nCatch-check: ₹2,500 joining fee, waived on ₹3L annual spend.\n\nWho this is for: anyone at ₹1L+ salary who travels ≥ 2 flights/year.`,
        cta: 'Apply to Regalia Gold',
        why: 'Math breakdown > claim. Specific redemption math = trust.' },
      { day: 10, time: '11:00 AM', type: 'push', hook: 'H12', title: 'Rewards = 1 free EMI',
        body: '₹40K/mo × 2% × 3 months = ₹2,400 = one EMI paid by card rewards alone.',
        cta: 'See cards',
        why: 'H12. Ties card value directly to loan relief.' },
      { day: 18, time: '9:00 AM', type: 'push', hook: 'H6', title: 'Next loan? Take the card with it — fees waived',
        body: 'Bundle deal: next personal loan + credit card together = ₹1,249 in fee waivers.',
        cta: 'See combo',
        why: 'H6. Pre-qualify them for the NEXT loan-card bundle while they\'re active.' },
      { day: 30, time: '10:00 AM', type: 'email', hook: 'H12', subject: 'Month 1 projection · card rewards could cover 16% of your EMI',
        preheader: 'Based on your income band, here\'s the trajectory.',
        body: `Based on your income band, a card user with your profile typically earns:\n\n~₹2,400 in rewards in month 1\nEMI this month: ₹4,850 (indicative)\n\nThat\'s 16% of one EMI — offset by card rewards alone.\n\nAt this pace, by month 6 cumulative rewards = ~1.2× a monthly EMI. Month 7 onward, rewards can pay a full EMI each month.\n\nNo action needed. This is what happens when you use the card for everyday spend.`,
        cta: 'See full trajectory',
        why: 'Reframed as income-band projection. Fibe does not own issuer spend data — no fabricated actuals.' },
    ],
  },
  {
    id: 5, name: 'Approved, no loan taken',
    persona: 'Got approved. Walked away. Eligibility already cleared.',
    cap: '5 messages',
    messages: [
      { day: 1, time: '11:00 AM', type: 'push', hook: 'H3', title: 'Approved — but didn\'t need the cash?',
        body: 'Take a lifetime-free card instead. Same eligibility. Zero fee. ₹500 back on first spend.',
        cta: 'Claim card',
        why: 'Reuse their cleared eligibility — zero incremental KYC.' },
      { day: 3, time: '7:00 PM', type: 'push', hook: 'H11', title: 'You qualify for HDFC Regalia Gold — 1L points',
        body: 'Same income you proved on the loan = qualified for ₹25K in flights & hotels.',
        cta: 'Apply',
        why: 'Your eligibility is fresh — leverage for a premium upgrade ask.' },
      { day: 7, time: '10:00 AM', type: 'push', hook: 'H5', title: 'Based on your declared spend — save ₹18,400/yr',
        body: 'HDFC IndianOil card. 5% on fuel. LTF. Pre-approved.',
        cta: 'See card',
        why: 'Personalised reco using loan-app spend declarations.' },
      { day: 14, time: '8:00 PM', type: 'email', hook: 'H3', subject: 'No loan? Take a card — same eligibility you already cleared',
        preheader: 'LTF + ₹500 signup bonus. Pre-approved.',
        body: `You passed Fibe's approval for a loan last week but didn't draw it. Your eligibility is still live.\n\nThree cards you qualify for instantly (no new KYC):\n\n1. Axis Ace — LTF, 2% on bills + rides\n2. HDFC MoneyBack+ — LTF, 5% on Amazon & Flipkart\n3. SBI SimplyClick — LTF, 10× online rewards\n\nAll three use the same eligibility record from your loan app. 2-minute apply. Bank issues card in 5 days.`,
        cta: 'Pick one',
        why: 'Email for the thoughtful re-engagement. Emphasises zero-friction path.' },
      { day: 30, time: '10:00 AM', type: 'push', title: 'Still looking? Loan OR card — your call',
        body: 'Both products. Same app. Same pre-approved eligibility. No pressure.',
        cta: 'See both',
        why: 'Low-pressure final close. Respects their timeline.' },
    ],
  },
  {
    id: 6, name: 'Rejected, Fibe FD holder',
    persona: 'Rejected on loan. Has FD = liquidity exists. Honest FD-card path.',
    cap: '6 messages — "your FD earned this"',
    messages: [
      { day: 1, time: '11:00 AM', type: 'push', hook: 'H7', title: 'Your FD is working harder than you think',
        body: 'You have ₹50,000 in Fibe FD. Unlock a credit card against it — FD keeps earning, card gives credit.',
        cta: 'See FD-backed cards',
        why: 'FD = already-earned trust signal. Reframe from "rejected" to "unlocked."' },
      { day: 3, time: '10:00 AM', type: 'push', hook: 'H7', title: 'You don\'t break the FD. You don\'t lose interest.',
        body: '₹50K FD = ₹50K credit line. FIRST EARN or Axis Insta. Bank approves most in 24 hours. FD stays at 7.5%.',
        cta: 'See how it works',
        why: 'Biggest objection ("will I lose FD returns?") moved to D3 — kills it faster. No "guaranteed" language — regulatory safe.' },
      { day: 5, time: '8:00 PM', type: 'push', hook: 'H7', title: '₹50K FD = ₹50K credit line · zero joining fee',
        body: 'FIRST EARN or Axis Insta — 1:1 credit against your FD. Bank approves most FD-backed apps in 24 hours.',
        cta: 'Apply',
        why: 'Name the cards. 1:1 math explicit. "Most within 24 hours" replaces "guaranteed" throughout.' },
      { day: 7, time: '8:00 PM', type: 'email', hook: 'H7', subject: 'Your Fibe FD just became a credit card',
        preheader: 'Same FD. Same returns. Plus a credit line.',
        body: `Your ₹50,000 Fibe FD is eligible for these 3 FD-backed cards:\n\n1. FIRST EARN — 1:1 credit, 10% LTV optional top-up, zero joining fee\n2. Axis Insta Easy — 100% credit against FD, 10× rewards on dining\n3. SBI Unnati — ₹0 annual fee for 4 years, 4% cashback on Amazon\n\nAll three approve within 24 hours — your FD is pre-verified.\n\nYour FD continues earning 7.5% p.a. throughout. The card is in addition, not instead.\n\nMonth-over-month data: users who start here see their credit score rise 40–80 points in 6 months. That opens unsecured cards and Fibe loan eligibility.`,
        cta: 'Pick 1 of 3',
        why: 'FD-holders are liquidity-rich, trust-scarred. Email unpacks the full mechanic + downstream payoff.' },
      { day: 14, time: '11:00 AM', type: 'push', hook: 'H7', title: 'Approval ready · secured card can issue today',
        body: 'Bank approves most FD-backed applications within 24 hours.',
        cta: 'Complete · 1 min',
        why: 'Urgency framing. "Most within 24 hours" — honest speed claim, no guarantee.' },
      { day: 21, time: '10:00 AM', type: 'push', hook: 'H7', title: 'FD card users: credit score +40–80 in 6 months',
        body: 'Based on Great.Cards secured-card data (10K+ users). That\'s the gap to unsecured eligibility.',
        cta: 'Start the ladder',
        why: 'GC portfolio data — citable source, not fabricated stat.' },
    ],
  },
  {
    id: 7, name: 'Rejected, salvageable (low score, no FD)',
    persona: 'Rejected on loan. Credit score at 640. Target: 720. No FD liquidity. Empathetic + builder narrative.',
    cap: '6 messages · credit-builder narrative only',
    messages: [
      { day: 1, time: '11:00 AM', type: 'push', hook: 'H7', title: 'We know that wasn\'t the answer you wanted.',
        body: 'Here\'s the 6-month playbook. One card, three habits, loan-eligible by month 6.',
        cta: 'See the plan',
        why: 'One sentence of empathy, then agency. Never "rejected." Plan language gives control back.' },
      { day: 3, time: '10:00 AM', type: 'push', hook: 'H7', title: 'Your score: 640 · target: 720 · gap: 80 points',
        body: 'Most users close this gap in 4–6 months with a secured card + on-time payments.',
        cta: 'See the playbook',
        why: 'Hardcoded bucket + target. Specific > abstract. Math beats narrative.' },
      { day: 7, time: '8:00 PM', type: 'email', hook: 'H7', subject: 'The reason we said no — and the fix.',
        preheader: '640 today. 720 target. Here\'s the 6-month path.',
        body: `We weren't able to approve your loan last week. Here's why, in plain language, and what you can do:\n\nYour credit score sits at 640. Fibe's loan threshold is 720. The gap is 80 points — fixable in 4–6 months.\n\nThe playbook:\n\n  1. Open a FIRST EARN secured card — ₹10,000 FD, ₹10,000 credit line.\n  2. Use it for 3 regular payments a month — OTT, mobile recharge, grocery.\n  3. Pay the bill in full, 3 days before the due date. Every month.\n\nAfter 4–6 months of this, your score clears the Fibe loan threshold. Based on Great.Cards secured-card data (10K+ users, 6-month window): average jump +47 points, median +56.\n\nThis isn't a sales pitch. It's the exact 6-month plan we'd tell our own family.\n\nYou pick when to start. If never, no follow-up.`,
        cta: 'Start the plan — ₹10K FD',
        why: 'Stat attributed to Great.Cards secured-card portfolio data — citable, not fabricated. Specific FIRST EARN card, specific behaviour steps.' },
      { day: 14, time: '9:00 AM', type: 'push', hook: 'H7', title: 'Month 1 of your score plan',
        body: 'You haven\'t started yet. The sooner you begin, the sooner you\'re loan-eligible.',
        cta: 'Start today',
        why: 'Gentle reactivation. No pressure, just math on time.' },
      { day: 21, time: '11:00 AM', type: 'push', hook: 'H7', title: 'FIRST EARN — 24hr approval · ₹10K FD',
        body: 'Lowest-friction secured card in the Fibe app. FD earns 7.5% while it works.',
        cta: 'Apply',
        why: 'Name the card + the approval speed. Remove friction objection.' },
      { day: 30, time: '10:00 AM', type: 'push', hook: 'H7', title: 'Check-in: how\'s month 1 going?',
        body: 'Start today, we check in again month 3. If score up, we show unsecured options.',
        cta: 'Keep going',
        why: 'Quarterly touch = relationship, not sales.' },
    ],
  },
  {
    id: 8, name: 'Rejected, unsalvageable',
    persona: 'Pincode not served (400088). Bank will also reject. No credit-score-lift path.',
    cap: '1 email · don\'t burn the relationship',
    messages: [
      { day: 1, time: '9:00 AM', type: 'email', subject: 'We couldn\'t approve you — here\'s honest feedback.',
        preheader: 'One message. Specific reason. No spam.',
        body: `We couldn't approve your application this time.\n\nThe reason: we don't yet serve the 400088 pincode — our partner-bank coverage area doesn't include it.\n\nWe're not going to pretend another lender will have different answers. They almost certainly won't, because the bank-side pincode restriction is shared across most digital lenders in India.\n\nWhat we can do:\n\n  → If your pincode changes (new residence, office relocation), reapply. No fee, no wait period.\n  → Your free credit score is always available on Fibe. Check it any time.\n  → We won't keep pinging you with offers. You'll hear from us only if something specific to your pincode opens up.\n\nThis is our only message. No Day 7, no Day 30, no "last chance."\n\nIf circumstances change, we're here.`,
        cta: null,
        why: 'Variable hardcoded: pincode 400088. Reason is specific. Most fintechs sell anyway — we don\'t. Brand equity play.' },
    ],
  },
  {
    id: 9, name: 'Credit-widget users (score viewed, no action)',
    persona: 'Score widget viewed. Dormant top-of-funnel. Triggered on bucket changes.',
    cap: '8 messages across year, fired on score-bucket changes',
    messages: [
      { day: 1, time: 'on 700→750 shift', type: 'push', hook: 'H4', title: 'Your score just unlocked 3 new cards',
        body: '750+ = HDFC Regalia Gold, SBI Elite, Amex MRCC are now within reach. Pre-eligibility checked.',
        cta: 'See the 3',
        why: 'H4 Score unlock. 50-pt bands aligned to bucketScore() — real trigger fires.' },
      { day: 1, time: 'on 700→750 shift', type: 'push', hook: 'H4', title: '750 is the band where you save ₹20K+/yr on a card',
        body: 'Premium cashback tier opens up here. 3-card shortlist inside.',
        cta: 'See savings',
        why: 'Follow-up to bucket-change alert — adds savings math. 50-pt band.' },
      { day: 1, time: 'on 750→800 shift', type: 'push', hook: 'H4', title: 'You\'re in premium territory',
        body: 'Cards people at 800+ actually use: HDFC Infinia, Axis Magnus, Amex Platinum. 3-pick.',
        cta: 'See the 3',
        why: '800+ is the super-prime unlock. Aspirational tier, matched cards.' },
      { day: 7, time: '6:00 PM', type: 'push', hook: 'H5', title: 'Your credit score at 750 = ₹12,000 cashback/yr missed',
        body: 'Most users at your band apply within 30 days of checking. You haven\'t. Here\'s the card.',
        cta: 'See HDFC Regalia',
        why: 'Loss-framing. Most effective on prime-band dormant users.' },
      { day: 14, time: '8:00 PM', type: 'email', hook: 'H4', subject: 'Score ↑ means new cards unlocked · here\'s your shortlist',
        preheader: 'Bucket change = pre-eligibility reset. Apply now.',
        body: `Every time your credit score crosses a band, a new set of cards becomes eligible for you — with better rewards, higher credit limits, lower fees.\n\nYour current band (750–799) unlocks:\n\n1. HDFC Regalia Gold — 4× rewards on dining + travel\n2. SBI Elite — 5× on flights, complimentary lounge access\n3. Amex MRCC — 18× rewards on spending categories you pick\n\nAll three skip the "new-to-credit" tier. Full-benefit eligibility from day 1.\n\nThis offer resets when your band changes again.`,
        cta: 'See all 3',
        why: 'Expand score-unlock into full catalog. Email = room for all 3 cards + mechanic.' },
      { day: 30, time: '11:00 AM', type: 'push', hook: 'H5', title: 'Monthly score digest · 1 card matched',
        body: 'Your score held at 752. This month\'s top-match: SBI Elite — 5× on flights.',
        cta: 'See card',
        why: 'Monthly ritual builds stickiness. Always one concrete card.' },
      { day: 60, time: '10:00 AM', type: 'push', hook: 'H3', title: 'Still at 750 — still eligible for 3 premium cards',
        body: 'You\'ve seen these before. Nothing has changed. 2-minute apply.',
        cta: 'See the 3',
        why: 'Low-key re-reminder. Same cards, same eligibility.' },
      { day: 90, time: '9:00 AM', type: 'push', hook: 'H5', title: 'Your score vs your spend: ₹22,400/yr on the table',
        body: 'Based on your score + average spend, an HDFC Regalia saves you ₹22K/yr vs no card.',
        cta: 'See the math',
        why: 'Quarterly touch. Fresh angle — spend-vs-score math.' },
    ],
  },
  {
    id: 10, name: 'Repeat loan taker',
    persona: 'Second or subsequent loan. Highest trust, shortest path. Highest LTV, highest issuer approval rate.',
    cap: '3 messages over 30 days — priority #2 in the system',
    messages: [
      { day: 1, time: '2hr post-disbursal', type: 'push', hook: 'H5', title: 'You\'re back — 3 cards matched to your profile',
        body: '[Top 3 cards] for your income + score. No pitch, just the shortlist. Fallback: Axis Ace · HDFC MoneyBack+ · SBI SimplyClick.',
        cta: 'See my 3',
        why: 'Welcome back, no re-intro. Pre-approval NOT claimed — only "matched." Fallback prevents bracket leak.' },
      { day: 14, time: '10:00 AM', type: 'push', hook: 'H12', title: '[Card name] — your first bill arrives around 30 days after activation',
        body: 'Paying in full every cycle builds your score fastest. Fallback: HDFC MoneyBack+.',
        cta: 'See card',
        why: 'Timing-agnostic reframe — no issuer statement-cycle data required. Behavioural nudge, not a sales pitch.' },
      { day: 30, time: '8:00 PM', type: 'email', hook: 'H12', subject: 'Your loan + a card together — here\'s what changes',
        preheader: 'Income-band projection, not fabricated spend.',
        body: `You took your second loan with us this month. Here's what adding a card on top looks like, based on your income band:\n\n  EMI: ~₹4,850/mo (indicative)\n  Card rewards (month 1 typical): ~₹2,400\n  Offset: 16% of one EMI, covered by card rewards\n\nMonth 6 trajectory: ~1.2× monthly EMI covered by cumulative rewards.\nMonth 7 onward: a full EMI / month, covered by rewards.\n\nThis isn't projection sold as fact — it's what typically happens when a loan customer at your income band uses the card for everyday spend.`,
        cta: 'See the math',
        why: 'H12 rewards-offset-EMI. D30 timing = card spend has happened. Income-band projection, no fabricated actuals.' },
    ],
  },
  {
    id: 11, name: 'Dormant 90+ days',
    persona: 'No app activity for 90 days. Push tokens likely expired. Email only.',
    cap: '1 email · no push (dormant tokens train OS suppression)',
    messages: [
      { day: 90, time: '10:00 AM', type: 'email', hook: 'H5', subject: 'One card. One number. No guilt.',
        preheader: 'HDFC MoneyBack+ · ₹12,000/yr. That\'s it.',
        body: `[Spend-matched card] saves you roughly [₹X]/yr based on your declared spend pattern. Fallback: HDFC MoneyBack+ · ₹12,000/yr.\n\nLTF. 2-minute apply. Bank approval in 3 working days.\n\nThat\'s it. No recap of what you haven\'t done. If you\'re not interested, you won\'t hear from us again.`,
        cta: 'See the card',
        why: 'Single card, single ₹, single CTA. Three sentences max before CTA. No "we miss you." No guilt. Email only — push dead.' },
    ],
  },
  {
    id: 12, name: 'Time-based card holder re-engagement',
    persona: '6 months after card_issued_date. Additive, not replacement.',
    cap: '1 message per 6-month window',
    messages: [
      { day: 180, time: '11:00 AM', type: 'push', hook: 'H5', title: '6 months in — here\'s a card that stacks on yours',
        body: '[Complementary stacking card] covers a category your current card doesn\'t. Fallback: SBI Cashback.',
        cta: 'See stacking card',
        why: 'No spend data assumed — category inference from loan-app declarations only. Spend-based re-engagement = Phase 2.' },
    ],
  },
];

let notifState = { cohortId: 1, msgIndex: 0 };

function renderNotificationsTab() {
  const extra = document.getElementById('tabExtra');
  extra.innerHTML = `
    <div class="grid gap-4" style="grid-template-columns: minmax(220px, 260px) 1fr">
      <div class="bg-white/5 border border-white/10 rounded-xl p-3" id="cohortListWrap">
        <p class="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-2 px-1">Cohorts · ${COHORTS.length}</p>
        <div class="space-y-1" id="cohortList">
          ${COHORTS.map(c => `
            <div class="placement-item ${c.id === notifState.cohortId ? 'active' : ''}" data-cid="${c.id}">
              <span class="num">${c.id}</span>
              <span class="name">${c.name}${c.silent ? ' <span style="color:#f87171;font-size:10px;font-weight:700">· SILENT</span>' : ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div id="cohortDetail" class="space-y-4"></div>
    </div>
  `;
  extra.querySelectorAll('#cohortList .placement-item').forEach(el => {
    el.addEventListener('click', () => {
      notifState.cohortId = parseInt(el.dataset.cid, 10);
      notifState.msgIndex = 0;
      extra.querySelectorAll('#cohortList .placement-item').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      renderNotifCohort();
    });
  });
  renderNotifCohort();
}

function renderNotifCohort() {
  const c = COHORTS.find(x => x.id === notifState.cohortId);
  if (!c) return;
  const detail = document.getElementById('cohortDetail');
  if (!detail) return;

  detail.innerHTML = `
    <div class="rs-block">
      <h3>Cohort ${c.id}</h3>
      <p class="text-white font-semibold text-[15px] mb-1">${c.name}</p>
      <p class="text-slate-400 text-[12px] leading-relaxed">${c.persona}</p>
    </div>
    <div class="rs-block">
      <h3>Cap</h3>
      <p class="text-[12px]">${c.cap}</p>
    </div>
    ${c.silent ? `
      <div class="rs-constraint">
        <strong>Silent cohort.</strong> ${c.silentReason}
      </div>
    ` : `
      <div class="rs-block">
        <h3>Messages in arc · ${c.messages.length}</h3>
        <div class="grid grid-cols-2 gap-1.5" id="msgPicker">
          ${c.messages.map((m, i) => `
            <button class="msg-btn text-left px-3 py-2 rounded-md ${i === notifState.msgIndex ? 'active' : ''}" data-mi="${i}">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                <span class="text-[10px] font-bold uppercase tracking-wider" style="color:${m.type === 'email' ? '#fbbf24' : '#5eead4'}">${m.type}</span>
                <span class="text-[10px] text-slate-400">Day ${m.day}</span>
                ${m.hook ? `<span style="font-size:9px;font-weight:700;color:#c4b5fd;background:rgba(139,92,246,0.15);padding:1px 5px;border-radius:3px;margin-left:auto">${m.hook}</span>` : ''}
              </div>
              <div style="font-size:11px;color:#cbd5e1;margin-top:3px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${escapeHtml(m.title || m.subject || '')}</div>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="rs-block">
        <h3>Why this copy</h3>
        <p class="text-[12.5px] leading-relaxed" id="whyCopy">${c.messages[notifState.msgIndex]?.why || ''}</p>
      </div>
    `}
  `;

  // style msg-btn
  if (!document.getElementById('msgBtnStyle')) {
    const style = document.createElement('style');
    style.id = 'msgBtnStyle';
    style.textContent = `
      .msg-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 120ms; }
      .msg-btn:hover { background: rgba(255,255,255,0.07); }
      .msg-btn.active { background: rgba(0,103,103,0.22); border-color: #006767; }
    `;
    document.head.appendChild(style);
  }

  // wire msg picker
  if (!c.silent) {
    detail.querySelectorAll('.msg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        notifState.msgIndex = parseInt(btn.dataset.mi, 10);
        detail.querySelectorAll('.msg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('whyCopy').textContent = c.messages[notifState.msgIndex].why;
        paintPhoneNotif(c, c.messages[notifState.msgIndex]);
      });
    });
  }

  if (c.silent) paintPhoneSilent(c);
  else paintPhoneNotif(c, c.messages[notifState.msgIndex]);
}

// Resolve personalization brackets AND strip spec meta copy before rendering.
// Every bracketed variable has a fallback (see docs/05-NOTIFICATIONS-COPY.md § Fallback).
// Order: (1) pick top eligible cards for this user, (2) substitute, (3) scrub "Fallback:..." sentences.
function topEligibleCards(n = 3) {
  const score = bucketScore(state.creditScore);
  const income = roundIncome(state.monthlyIncome);
  const cards = (state.initCards || []).filter(c =>
    (!c.employment_type || c.employment_type === 'both' || c.employment_type === state.employmentType) &&
    parseFloat(c.crif || 0) <= score &&
    parseFloat(c.income || 0) <= income
  );
  return cards.slice(0, n).map(normalizeCard).filter(Boolean);
}

function resolveNotifVars(text, ctx) {
  if (!text) return text;
  const top = ctx.top3 || [];
  const lead = top[0];
  const leadName = lead ? shortCardName(lead.name) : 'HDFC MoneyBack+';
  const top3Str = top.length >= 3
    ? top.slice(0, 3).map(c => shortCardName(c.name)).join(' · ')
    : 'Axis Ace · HDFC MoneyBack+ · SBI SimplyClick';
  const savings = '₹' + fmt(ctx.savings || 12000);
  return String(text)
    // Card-name variants
    .replace(/\[Spend-matched card(?: name)?\]/gi, leadName)
    .replace(/\[Top card name\]/gi, leadName)
    .replace(/\[Card name\]/gi, leadName)
    .replace(/\[Highest-saving card(?: for your profile)?\]/gi, leadName)
    .replace(/\[Complementary stacking card\]/gi, leadName)
    // List variant
    .replace(/\[Top 3 cards\]/gi, top3Str)
    // ₹ variants — handle [₹ savings/yr], [₹X]/yr, [₹X]
    .replace(/\[₹\s*savings\/yr\]/gi, savings + '/yr')
    .replace(/\[₹X\]\/yr/gi, savings + '/yr')
    .replace(/\[₹X\]/gi, savings)
    // Strip spec-meta "Fallback: ..." sentences (PM-facing, not user-facing)
    .replace(/\s*Fallback:[^.]*\.\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function paintPhoneSilent(c) {
  const phone = document.getElementById('phoneInner');
  phone.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:40px 24px;text-align:center;background:#F7F8FA">
      <div style="font-size:48px;margin-bottom:16px">🔕</div>
      <div style="font-size:15px;font-weight:700;color:#191c1d;margin-bottom:8px">No messages sent</div>
      <div style="font-size:13px;color:#64748b;line-height:1.5">Loan decision pending. Silence is the product.</div>
    </div>
  `;
}

function paintPhoneNotif(c, m) {
  const phone = document.getElementById('phoneInner');
  if (!m) return;

  // Resolve personalization variables + strip spec meta before rendering.
  const top3 = topEligibleCards(3);
  const ctx = { top3, savings: 12000 };
  const title = resolveNotifVars(m.title || '', ctx);
  const body = resolveNotifVars(m.body || '', ctx);
  const subject = resolveNotifVars(m.subject || '', ctx);
  const preheader = resolveNotifVars(m.preheader || '', ctx);
  const cta = resolveNotifVars(m.cta || '', ctx);
  const lead = top3[0];

  // Only inject a card-face when the ORIGINAL copy referenced a card variable
  // or when the cohort is card-centric and we have an eligible lead card.
  const referencedCard = /\[(?:Card name|Spend-matched card|Top card name|Top 3 cards|Highest-saving card|Complementary stacking card)\]/i.test(
    (m.title || '') + ' ' + (m.body || '')
  );
  const showFace = lead && referencedCard;

  if (m.type === 'push') {
    phone.innerHTML = `
      <div style="height:100%;background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);padding:44px 12px 12px 12px;display:flex;flex-direction:column">
        <div style="text-align:center;color:#cbd5e1;margin-bottom:8px">
          <div style="font-size:60px;font-weight:300;line-height:1;letter-spacing:-0.02em">${(m.time || '').split(' ')[0] || '10:00'}</div>
          <div style="font-size:14px;font-weight:500;margin-top:4px;opacity:0.9">Day ${m.day} · Tuesday</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;padding-bottom:20px">
          <div style="background:rgba(255,255,255,0.18);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:18px;padding:12px 14px;border:1px solid rgba(255,255,255,0.12)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:20px;height:20px;border-radius:5px;background:#006767;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800">F</div>
              <div style="font-size:11px;font-weight:600;color:#e2e8f0;text-transform:uppercase;letter-spacing:0.04em">FIBE</div>
              ${m.hook ? `<span style="font-size:9px;font-weight:700;color:#c4b5fd;background:rgba(139,92,246,0.2);padding:1px 5px;border-radius:3px">${m.hook}</span>` : ''}
              <div style="margin-left:auto;font-size:10px;color:#94a3b8">now</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:3px;line-height:1.3">${escapeHtml(title)}</div>
            <div style="font-size:12px;color:#e2e8f0;line-height:1.4">${escapeHtml(body)}</div>
            ${showFace ? `
              <div style="display:flex;gap:8px;align-items:center;margin-top:10px;padding:8px;background:rgba(255,255,255,0.08);border-radius:10px">
                ${renderCardFace(lead, { size: 'sm' })}
                <div style="flex:1;min-width:0">
                  <div style="font-size:11px;font-weight:700;color:#fff;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(shortCardName(lead.name))}</div>
                  <div style="font-size:9.5px;color:#94a3b8;margin-top:1px">${lead.isLTF ? 'Lifetime free' : 'Premium card'}</div>
                </div>
              </div>
            ` : ''}
          </div>
          ${cta ? `<div style="background:#006767;color:#fff;font-size:12px;font-weight:700;padding:10px 14px;border-radius:12px;text-align:center">${escapeHtml(cta)}</div>` : ''}
        </div>
      </div>
    `;
  } else if (m.type === 'email') {
    phone.innerHTML = `
      <div class="fi-header"><div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div><div class="fi-title">Inbox</div></div>
      <div style="height:calc(100% - 72px);overflow-y:auto;padding:16px;background:#fff">
        <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid #e7e8e9;margin-bottom:12px">
          <div style="width:36px;height:36px;border-radius:50%;background:#006767;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">F</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:#191c1d">Team Fibe</div>
            <div style="font-size:10px;color:#64748b">to abhyudaya@mail.com · Day ${m.day} · ${m.time}</div>
          </div>
        </div>
        ${m.hook ? `<div style="display:inline-block;font-size:9px;font-weight:700;color:#6d28d9;background:#ede9fe;padding:2px 7px;border-radius:3px;margin-bottom:6px;letter-spacing:0.04em">${m.hook}</div>` : ''}
        <div style="font-size:14px;font-weight:700;color:#191c1d;line-height:1.35;margin-bottom:4px">${escapeHtml(subject)}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:14px;font-style:italic">${escapeHtml(preheader)}</div>
        ${showFace ? `
          <div style="display:flex;gap:10px;align-items:center;padding:10px;background:#f8fafc;border-radius:10px;margin-bottom:14px">
            ${renderCardFace(lead, { size: 'md' })}
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:700;color:#191c1d;line-height:1.2">${escapeHtml(shortCardName(lead.name))}</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px">${lead.bank || ''}</div>
              ${lead.isLTF ? `<div style="display:inline-block;font-size:9px;font-weight:700;color:#006767;background:#00676715;padding:2px 6px;border-radius:4px;margin-top:4px;letter-spacing:0.04em;text-transform:uppercase">Lifetime free</div>` : ''}
            </div>
          </div>
        ` : ''}
        <div style="font-size:12.5px;color:#334155;line-height:1.55;white-space:pre-wrap;font-family:'Plus Jakarta Sans',sans-serif">${escapeHtml(body)}</div>
        ${cta ? `<div style="background:#006767;color:#fff;font-size:12px;font-weight:700;padding:10px 14px;border-radius:8px;text-align:center;margin-top:16px;display:inline-block">${escapeHtml(cta)} →</div>` : ''}
      </div>
    `;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// ─── Tab 3: Marketing Hooks ─────────────────────────────────────────────────

const HOOKS = [
  { id: 1, name: 'EMI on us', tagline: '₹1,500 EMI reimbursement',
    promise: 'Take this card, swipe ₹10K+ in 30 days. We pay your next loan EMI — up to ₹1,500.',
    cohort: 'Approved + loan taken (≤90d)', cost: 1050, envelope: 950,
    baseline: 5, lift: 13, phase1: true,
    surface: 'banner',
    phoneTitle: '₹1,50,000 credited ✓',
    phoneBody: 'Swipe ₹10K on this card in 30 days — we pay your next EMI. Up to ₹1,500.',
    phoneCta: 'Claim the card' },
  { id: 2, name: 'Play & Win', tagline: 'Gamified LTF unlock',
    promise: 'Play Slash-the-Fruits with 500 FibeCoins. Win 3 in a row → joining fee waived forever on the card of your choice.',
    cohort: 'Rewards-engaged (Media 3 players)', cost: 400, envelope: 1600,
    baseline: 1.5, lift: 5,
    surface: 'game',
    phoneTitle: 'You won! 🎉',
    phoneBody: '3 wins in a row — pick your free card',
    phoneCta: 'Claim my card' },
  { id: 3, name: 'LTF + ₹500', tagline: 'Zero fee + ₹500 bonus',
    promise: 'Zero joining fee. Zero annual fee. ₹500 cashback on first ₹1,000 spend.',
    cohort: 'Registered + PAN, no loan', cost: 0, envelope: 2000,
    baseline: 2, lift: 6, phase1: true,
    surface: 'card',
    phoneTitle: 'Lifetime free · ₹500 back',
    phoneBody: 'Axis Ace Credit Card — no joining, no annual fee. Spend ₹1,000, get ₹500 back.',
    phoneCta: 'Apply — 2 min' },
  { id: 4, name: 'Score unlock', tagline: '750+ reveals 3 new cards',
    promise: 'Score crossed 750? Three new premium cards are now within reach. Pre-eligibility checked.',
    cohort: 'Credit-widget users at bucket change', cost: 0, envelope: 2000,
    baseline: 0.5, lift: 3.5, phase1: true,
    surface: 'score',
    phoneTitle: 'Your score: 752 🎉',
    phoneBody: '+18 since last check. 3 new premium cards just unlocked.',
    phoneCta: 'See the 3' },
  { id: 5, name: 'Personalised', tagline: 'Specific savings math',
    promise: 'Based on your last 6 EMIs and spend pattern, this card saves you ₹38,000 over 12 months.',
    cohort: 'Active borrower, ≥3 EMIs paid (Phase 3)', cost: 0, envelope: 2000,
    baseline: 3, lift: 8.5,
    surface: 'personalised',
    phoneTitle: 'Matched to your spend',
    phoneBody: 'HDFC Millennia — Save ₹38,000/yr based on your last 6 months of Fibe data.',
    phoneCta: 'See the math' },
  { id: 6, name: 'Card + loan combo', tagline: 'Waive both fees',
    promise: 'Take any loan + this card together. Loan processing fee waived AND ₹750 off joining fee. Combo-only.',
    cohort: 'Approved-not-yet-disbursed loan', cost: 500, envelope: 1500,
    baseline: 5, lift: 12,
    surface: 'combo',
    phoneTitle: 'Add a card?',
    phoneBody: 'Bundle saves you ₹1,249 in fees. One checkout, both products.',
    phoneCta: 'Add to loan' },
  { id: 7, name: 'FD → unsecured ladder', tagline: '6-month path to unsecured',
    promise: 'Start with a FD-backed card. 6 on-time payments → HDFC Millennia unsecured. We handle the upgrade.',
    cohort: 'Rejected-low-score with ₹10K liquidity', cost: 0, envelope: 4000,
    baseline: 0.5, lift: 2,
    surface: 'ladder',
    phoneTitle: 'Your 6-month path',
    phoneBody: 'Month 0–6: FIRST EARN secured card. Month 7: HDFC Millennia unsecured. Automatic.',
    phoneCta: 'Start month 0' },
  { id: 8, name: 'Referral', tagline: '₹1,000 per approved card',
    promise: 'Refer 3 friends who get a card. ₹1,000 per approved card. ₹3,000 on 3.',
    cohort: 'Any user with a card via Fibe', cost: 1000, envelope: 1000,
    baseline: 1, lift: 5,
    surface: 'referral',
    phoneTitle: 'Your referral code',
    phoneBody: 'ABHI300 · Share with 3 friends. ₹1,000 per card they get approved.',
    phoneCta: 'Share on WhatsApp' },
  { id: 9, name: 'Salary match', tagline: 'Peer-tier card reco',
    promise: 'Your salary crossed ₹1L. You\'re in premium territory. Take the card salaried-people-at-your-level actually use.',
    cohort: 'B2B wellness users at salary threshold', cost: 0, envelope: 2000,
    baseline: 3, lift: 7,
    surface: 'tier',
    phoneTitle: 'You\'re now in premium',
    phoneBody: 'HDFC Regalia Gold — what peers at ₹1L+ use. 4× rewards on dining, travel.',
    phoneCta: 'See the card' },
  { id: 10, name: '0% EMI', tagline: 'Financing you already do',
    promise: 'Take this card, get 0% EMI on 10K+ partner merchants — phones, electronics, insurance, education.',
    cohort: 'EMI-mindset users', cost: 0, envelope: 2000,
    baseline: 4, lift: 9,
    surface: 'emi',
    phoneTitle: '0% EMI on everything',
    phoneBody: '10K+ partner merchants. Already financing? Shift it to this card, pay 0 interest.',
    phoneCta: 'See card' },
  { id: 11, name: '1L points', tagline: 'Premium signup bonus',
    promise: 'Take this card, spend ₹50K in 30 days, get 1 lakh reward points. Worth ₹25,000.',
    cohort: 'High-income (≥₹1L/mo) disbursed-loan', cost: 0, envelope: 2000,
    baseline: 5, lift: 15,
    surface: 'premium',
    phoneTitle: '1,00,000 points in month 1',
    phoneBody: 'Spend ₹50K, get ₹25K in flights/hotels/gift cards. HDFC Regalia signup bonus.',
    phoneCta: 'Apply' },
  { id: 12, name: 'Rewards pay EMI', tagline: 'Math-first framing',
    promise: 'Use this card for 3 months. The rewards pay your 4th EMI. ₹40K × 2% × 3 = ₹2,400.',
    cohort: 'Approved-loan-active, spend ≥₹30K', cost: 0, envelope: 2000,
    baseline: 5, lift: 9,
    surface: 'math',
    phoneTitle: 'Rewards = 1 free EMI',
    phoneBody: '₹40K/mo × 2% × 3 months = ₹2,400. Your 4th EMI paid by card rewards.',
    phoneCta: 'See the math' },
];

let hookState = { hookId: 1 };

function renderHooksTab() {
  const extra = document.getElementById('tabExtra');
  extra.innerHTML = `
    <div class="grid gap-4" style="grid-template-columns: minmax(240px, 280px) 1fr">
      <div class="bg-white/5 border border-white/10 rounded-xl p-3" id="hookListWrap">
        <p class="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-2 px-1">Hooks · 12</p>
        <div class="space-y-1" id="hookList">
          ${HOOKS.map(h => `
            <div class="placement-item ${h.id === hookState.hookId ? 'active' : ''}" data-hid="${h.id}">
              <span class="num">H${h.id}</span>
              <span class="name">
                ${h.name}
                ${h.phase1 ? '<span style="color:#5eead4;font-size:9px;font-weight:700;margin-left:6px;background:rgba(94,234,212,0.1);padding:1px 5px;border-radius:3px">PHASE 1</span>' : ''}
                <div style="font-size:10px;font-weight:500;color:#64748b;margin-top:2px">${h.tagline}</div>
              </span>
            </div>
          `).join('')}
        </div>
      </div>
      <div id="hookDetail" class="space-y-4"></div>
    </div>
  `;
  extra.querySelectorAll('#hookList .placement-item').forEach(el => {
    el.addEventListener('click', () => {
      hookState.hookId = parseInt(el.dataset.hid, 10);
      extra.querySelectorAll('#hookList .placement-item').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      renderHook();
    });
  });
  renderHook();
}

function renderHook() {
  const h = HOOKS.find(x => x.id === hookState.hookId);
  if (!h) return;
  const detail = document.getElementById('hookDetail');
  if (!detail) return;

  // Cohorts this hook appears in (tagged via the `hook:` field on messages)
  const hookTag = 'H' + h.id;
  const appearsIn = COHORTS.filter(c => !c.silent && (c.messages || []).some(m => m.hook === hookTag));

  detail.innerHTML = `
    <div class="rs-block">
      <h3>Hook ${hookTag}</h3>
      <p class="text-white font-semibold text-[15px] mb-1">${h.name}</p>
      <p class="text-slate-300 text-[12.5px] leading-relaxed">${h.promise}</p>
    </div>
    <div class="rs-block">
      <h3>Target cohort + surface</h3>
      <div class="k"><span>cohort</span><span>${h.cohort}</span></div>
      <div class="k"><span>surface</span><span>${h.surface}</span></div>
      ${h.phase1 ? '<div class="k"><span>phase</span><span style="color:#5eead4">Phase 1 pilot stack</span></div>' : ''}
    </div>
    <div class="rs-block">
      <h3>Cost to deploy</h3>
      <div class="k"><span>hook cost</span><span style="color:${h.cost === 0 ? '#5eead4' : '#fbbf24'};font-weight:700">${h.cost === 0 ? 'FREE — merchandising only' : '₹' + fmt(h.cost) + ' / card'}</span></div>
      ${h.cost === 0 ? '<p class="text-[11px] text-slate-400 mt-2 leading-relaxed">No per-card outlay. Hook sits in copy + layout; zero spend lift.</p>' : '<p class="text-[11px] text-slate-400 mt-2 leading-relaxed">Cost deducted from commission envelope before any revenue split. Share arrangement discussed separately.</p>'}
    </div>
    ${appearsIn.length ? `
      <div class="rs-block">
        <h3>Delivered in notifications</h3>
        <p class="text-[11.5px] text-slate-400 mb-2 leading-relaxed">This hook surfaces inside the notification arcs for:</p>
        <div class="space-y-1">
          ${appearsIn.map(c => `
            <button class="w-full text-left px-3 py-2 rounded-md" data-jump-cohort="${c.id}" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);transition:all 120ms">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:10px;font-weight:700;color:#94a3b8">Cohort ${c.id}</span>
                <span style="font-size:12px;color:#e2e8f0;font-weight:600">${c.name}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    ` : `
      <div class="rs-block">
        <h3>Delivered in notifications</h3>
        <p class="text-[11.5px] text-slate-400 leading-relaxed">Not currently wired into a cohort arc — available for campaign pickup.</p>
      </div>
    `}
  `;

  // wire cohort jump buttons
  detail.querySelectorAll('[data-jump-cohort]').forEach(btn => {
    btn.addEventListener('click', () => {
      notifState.cohortId = parseInt(btn.dataset.jumpCohort, 10);
      notifState.msgIndex = 0;
      activateTab('notifications');
    });
  });

  paintPhoneHook(h);
}

// Each hook renders INSIDE its primary placement surface.
// The hook's offer is the copy that lives on that surface; the rest of the
// chrome is the real Fibe screen the user would see. A purple "H{id}" pill
// overlays the top-left so the reader knows which hook is being previewed.
const HOOK_TO_PLACEMENT_ID = {
  1:  3,   // EMI on us                → Post-disbursal
  2:  8,   // Play & Win                → Slash-the-Fruits
  3:  1,   // LTF + ₹500                → Homepage widget funnel (final cards state)
  4:  null,// Score unlock              → dedicated credit-score celebration
  5:  4,   // Personalised              → EMI tracker
  6:  null,// Card + loan combo         → dedicated combo screen (pre-disbursal)
  7:  2,   // FD → unsecured ladder     → FD section (with ladder overlay)
  8:  null,// Referral                  → dedicated referral screen
  9:  7,   // Salary match              → Tailor-made offers (super offer tile)
  10: 7,   // 0% EMI                    → Tailor-made offers
  11: 3,   // 1L points                 → Post-disbursal (premium framing)
  12: 4,   // Rewards pay EMI           → EMI tracker
};

function paintPhoneHook(h) {
  const phone = document.getElementById('phoneInner');
  const pid = HOOK_TO_PLACEMENT_ID[h.id];

  if (pid) {
    // Reuse the Fibe-native placement renderer with filtered cards
    const p = PLACEMENTS.find(x => x.id === pid);
    const cards = filterInitCards(p);
    // For P1, jump straight to the cards state (skip the funnel for hook previews)
    if (pid === 1) p1FunnelState = { step: 4, cats: ['online','dining','fuel'], spend: 45000 };
    if (pid === 2) p2State = { step: 1 };
    if (pid === 8) p8State = { step: h.id === 2 ? 'win' : 'arcade' };
    renderPlacementSurface(p, cards, phone);
    overlayHookBadge(phone, h);
    return;
  }

  // Dedicated surfaces (no matching placement)
  if (h.id === 4) renderHookSurface_ScoreUnlock(phone, h);
  else if (h.id === 6) renderHookSurface_LoanCombo(phone, h);
  else if (h.id === 8) renderHookSurface_Referral(phone, h);
  overlayHookBadge(phone, h);
}

function overlayHookBadge(phone, h) {
  const badge = document.createElement('div');
  badge.style.cssText = 'position:absolute;top:54px;left:14px;z-index:20;background:rgba(139,92,246,0.95);color:#fff;font-size:10px;font-weight:800;padding:4px 10px;border-radius:6px;letter-spacing:0.05em;box-shadow:0 2px 8px rgba(139,92,246,0.4);pointer-events:none';
  badge.textContent = `HOOK H${h.id} · ${h.name.toUpperCase()}`;
  phone.appendChild(badge);
}

// H4 — Credit score celebration (matching Media 2: gauge + greeting)
function renderHookSurface_ScoreUnlock(phone, h) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">CIR</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:14px 18px 18px;background:linear-gradient(180deg,#fff5f0 0%,#fff 30%,#fff 100%);position:relative">
        <div style="text-align:center;font-size:20px;font-weight:800;color:#191c1d;margin-bottom:14px">Hey, Abhyudaya 👋</div>
        <div style="position:relative;width:220px;height:120px;margin:0 auto 10px">
          <svg viewBox="0 0 200 110" style="width:100%;height:100%">
            <defs><linearGradient id="gArc" x1="0" x2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs>
            <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#e7e8e9" stroke-width="10" fill="none" stroke-linecap="round"/>
            <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="url(#gArc)" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="18"/>
            <polygon points="170,96 178,100 170,104" fill="#10b981"/>
          </svg>
          <div style="position:absolute;top:46%;left:0;right:0;text-align:center">
            <div style="font-size:11px;color:#64748b">Current score</div>
            <div style="font-size:28px;font-weight:800;color:#191c1d;line-height:1">752</div>
          </div>
          <div style="position:absolute;bottom:-2px;left:12px;font-size:10px;color:#64748b">300</div>
          <div style="position:absolute;bottom:-2px;right:12px;font-size:10px;color:#64748b">900</div>
        </div>
        <div style="text-align:center;margin-bottom:14px">
          <div style="display:inline-flex;align-items:center;gap:4px;background:#10b981;color:#fff;padding:3px 12px;border-radius:14px;font-size:11px;font-weight:700">Good <span class="material-symbols-outlined" style="font-size:12px">info</span></div>
          <div style="font-size:11px;color:#64748b;margin-top:8px">+18 since last check · Last updated 23/04/2026</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:2px">Powered by <b style="color:#dc2626">EQUIFAX</b></div>
        </div>
        <div style="background:#fff;border:2px solid #5eead4;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 4px 16px rgba(94,234,212,0.2)">
          <div style="display:flex;align-items:center;gap:6px;font-size:10px;font-weight:800;color:#0e7490;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">🎉 Just unlocked · 3 new premium cards</div>
          <div style="font-size:13px;color:#334155;line-height:1.5;margin-bottom:10px">Score crossed 750. These cards were out of reach last month — now pre-eligibility is confirmed.</div>
          <div style="display:flex;gap:6px;margin-bottom:12px">
            <div style="flex:1;height:54px;border-radius:6px;background:linear-gradient(135deg,#6b21a8,#3b0764);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;letter-spacing:0.04em">REGALIA</div>
            <div style="flex:1;height:54px;border-radius:6px;background:linear-gradient(135deg,#1e293b,#0f172a);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;letter-spacing:0.04em">SBI ELITE</div>
            <div style="flex:1;height:54px;border-radius:6px;background:linear-gradient(135deg,#0f766e,#134e4a);display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:800;letter-spacing:0.04em">AMEX</div>
          </div>
          <button style="width:100%;padding:11px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:13px;border:none">See the 3 unlocked →</button>
        </div>
      </div>
    </div>
  `;
}

// H6 — Card + loan combo (pre-disbursal approval screen)
function renderHookSurface_LoanCombo(phone, h) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Loan approved</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px">
        <div style="background:linear-gradient(135deg,#006767,#0e7490);color:#fff;padding:18px;border-radius:14px;margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;opacity:0.85;letter-spacing:0.04em">YOUR LOAN IS APPROVED</div>
          <div style="font-size:26px;font-weight:800;margin:4px 0">₹1,50,000</div>
          <div style="font-size:11px;opacity:0.85">Ready to disburse to HDFC ••••4521</div>
          <div style="margin-top:10px;display:flex;gap:6px;font-size:11px"><span style="background:rgba(255,255,255,0.2);padding:3px 9px;border-radius:10px">12 EMIs</span><span style="background:rgba(255,255,255,0.2);padding:3px 9px;border-radius:10px">₹13,450 / mo</span></div>
        </div>
        <div style="background:#fff;border:2px solid #5eead4;border-radius:14px;padding:14px;box-shadow:0 4px 16px rgba(94,234,212,0.18)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#006767,#0e7490);display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined" style="color:#fff;font-size:22px">credit_card</span></div>
            <div style="flex:1"><div style="font-size:14px;font-weight:800;color:#191c1d">Add a credit card?</div><div style="font-size:10px;color:#64748b;font-weight:500">Combo-only · expires at disbursal</div></div>
          </div>
          <div style="font-size:12px;color:#334155;line-height:1.5;margin-bottom:10px">Bundle saves you ₹1,249 in fees. One checkout, both products.</div>
          <div style="background:#F7F8FA;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px">
            <div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:#64748b">Loan processing fee</span><span style="color:#10b981;font-weight:700"><span style="text-decoration:line-through;color:#94a3b8;margin-right:4px">₹499</span>WAIVED</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px dashed #e7e8e9"><span style="color:#64748b">Card joining fee</span><span style="color:#10b981;font-weight:700">₹750 OFF</span></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0 0;border-top:1px solid #e7e8e9;margin-top:4px"><span style="color:#191c1d;font-weight:700">You save today</span><span style="color:#006767;font-weight:800;font-size:14px">₹1,249</span></div>
          </div>
          <button style="width:100%;padding:12px;border-radius:10px;background:#006767;color:#fff;font-weight:700;font-size:13px;border:none">Add card to loan</button>
        </div>
      </div>
    </div>
  `;
}

// H8 — Referral
function renderHookSurface_Referral(phone, h) {
  phone.innerHTML = `
    <div style="position:relative;height:100%;background:#F7F8FA;display:flex;flex-direction:column">
      <div class="fi-header">
        <div class="fi-back"><span class="material-symbols-outlined" style="font-size:22px">arrow_back</span></div>
        <div class="fi-title">Refer & Earn</div>
      </div>
      <div style="flex:1;overflow-y:auto">
        <div style="position:relative;padding:30px 20px 24px;background:linear-gradient(160deg,#fef3c7 0%,#fff 100%);text-align:center;overflow:hidden">
          <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 18% 30%,#ec4899 3px,transparent 3.5px),radial-gradient(circle at 82% 25%,#fbbf24 3px,transparent 3.5px),radial-gradient(circle at 35% 75%,#60a5fa 3px,transparent 3.5px),radial-gradient(circle at 72% 80%,#34d399 3px,transparent 3.5px);opacity:0.55"></div>
          <div style="position:relative">
            <div style="font-size:52px;margin-bottom:6px">🎁</div>
            <div style="font-size:22px;font-weight:800;color:#191c1d;line-height:1.15">Earn ₹3,000 for 3 friends</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">₹1,000 credited per approved card</div>
          </div>
        </div>
        <div style="padding:16px">
          <div style="background:#fff;border:2px dashed #006767;border-radius:14px;padding:16px;text-align:center;margin-bottom:12px">
            <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Your referral code</div>
            <div style="font-size:26px;font-weight:800;color:#006767;letter-spacing:0.18em;font-family:monospace">ABHI300</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:4px">Tap to copy</div>
          </div>
          <div style="background:linear-gradient(90deg,#25d366,#128c7e);color:#fff;font-size:13px;font-weight:700;padding:14px;border-radius:12px;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px"><span style="font-size:18px">📱</span> Share on WhatsApp</div>
          <div style="background:#fff;border:1px solid #e7e8e9;border-radius:12px;padding:12px;font-size:11px;color:#64748b;line-height:1.55"><b style="color:#191c1d">How it works:</b> Friend clicks your link → applies for any card → gets approved → ₹1,000 credited to your Fibe wallet. No cap, but first 3 also unlock a ₹500 bonus.</div>
        </div>
      </div>
    </div>
  `;
}

// ═════════════════════════════════════════════════════════════════════════════
// Other pages (placeholders — built next)
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: REVENUE
// ═════════════════════════════════════════════════════════════════════════════

const REV_SCENARIOS = {
  conservative: { mau: 900000, seePct: 35, clickPct: 3, applyPct: 60, approvalPct: 50, commission: 2000,
                  gcSplit: 28, teamCost: 1500000, infraCost: 200000, callerCost: 150, opsCost: 150, hookCost: 400 },
  realistic:    { mau: 900000, seePct: 50, clickPct: 4, applyPct: 70, approvalPct: 55, commission: 2000,
                  gcSplit: 30, teamCost: 2500000, infraCost: 300000, callerCost: 150, opsCost: 150, hookCost: 400 },
  aggressive:   { mau: 900000, seePct: 65, clickPct: 5, applyPct: 75, approvalPct: 60, commission: 2200,
                  gcSplit: 32, teamCost: 3500000, infraCost: 400000, callerCost: 150, opsCost: 150, hookCost: 500 },
};

let revState = { ...REV_SCENARIOS.conservative };

function mountRevenue() {
  renderRevFunnel();
  renderRevSplit();
  renderRevUnit();
  bindRevScenarios();
}

function bindRevScenarios() {
  document.querySelectorAll('.scn').forEach(btn => {
    btn.onclick = () => {
      revState = { ...REV_SCENARIOS[btn.dataset.scenario] };
      renderRevFunnel();
      renderRevSplit();
      renderRevUnit();
    };
  });
}

function revInp(key, val, suffix = '', width = '4ch') {
  return `<input class="inp" type="number" data-rev="${key}" value="${val}" style="min-width:${width}"/>${suffix}`;
}

function renderRevFunnel() {
  const s = revState;
  const users   = Math.round(s.mau * s.seePct / 100);
  const clicks  = Math.round(users * s.clickPct / 100);
  const applies = Math.round(clicks * s.applyPct / 100);
  const cards   = Math.round(applies * s.approvalPct / 100);
  const monthly = cards * s.commission;
  const annual  = monthly * 12;

  document.getElementById('revFunnel').innerHTML = `
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink">Fibe monthly active users</span>
      <span>${revInp('mau', s.mau, '', '7ch')}</span>
    </div>
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink/80">× ${revInp('seePct', s.seePct, '%')} see a placement</span>
      <span class="font-semibold text-teal">${fmt(users)} users</span>
    </div>
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink/80">× ${revInp('clickPct', s.clickPct, '%')} click through</span>
      <span class="font-semibold text-teal">${fmt(clicks)} clicks</span>
    </div>
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink/80">× ${revInp('applyPct', s.applyPct, '%')} apply</span>
      <span class="font-semibold text-teal">${fmt(applies)} applications</span>
    </div>
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink/80">× ${revInp('approvalPct', s.approvalPct, '%')} bank approval</span>
      <span class="font-semibold text-teal">${fmt(cards)} cards/month</span>
    </div>
    <div class="flex items-baseline justify-between py-2 border-b border-slate-100">
      <span class="text-ink/80">× ₹${revInp('commission', s.commission, '')} commission/card</span>
      <span class="font-semibold text-teal">${inrCr(monthly)}/month</span>
    </div>
    <div class="flex items-baseline justify-between py-3 border-t-2 border-ink/20 mt-2">
      <span class="text-ink font-semibold">= Annual gross</span>
      <span class="font-bold text-teal text-[22px]">${inrCr(annual)}</span>
    </div>
    <p class="text-[12px] text-mute mt-2">${fmt(cards * 12)} cards/year total · benchmark: Paisabazaar peak ~80–100K/yr.</p>
  `;

  document.querySelectorAll('#revFunnel .inp').forEach(inp => {
    inp.addEventListener('input', () => {
      revState[inp.dataset.rev] = parseFloat(inp.value) || 0;
      renderRevFunnel();
      renderRevSplit();
      renderRevUnit();
    });
  });
}

function renderRevSplit() {
  const s = revState;
  const cards  = Math.round(s.mau * s.seePct/100 * s.clickPct/100 * s.applyPct/100 * s.approvalPct/100);
  const annual = cards * 12 * s.commission;

  const rows = [
    { label: '70 / 30',   fibe: 70, gc: 30 },
    { label: '60 / 40',   fibe: 60, gc: 40 },
    { label: '50 / 50',   fibe: 50, gc: 50 },
  ];

  document.getElementById('revSplit').innerHTML = `
    <div class="grid grid-cols-3 text-[11px] uppercase tracking-wider font-semibold text-mute border-b border-slate-200 py-2">
      <div>Split (Fibe / GC)</div>
      <div class="text-right">Fibe share</div>
      <div class="text-right">GC share</div>
    </div>
    ${rows.map(r => `
      <div class="grid grid-cols-3 py-3 border-b border-slate-100 text-[15px]">
        <div class="text-ink font-semibold">${r.label}</div>
        <div class="text-right text-ink/80">${inrCr(annual * r.fibe / 100)}</div>
        <div class="text-right font-semibold text-teal">${inrCr(annual * r.gc / 100)}</div>
      </div>
    `).join('')}
  `;
}

function renderRevUnit() {
  const s = revState;
  const cardsYr  = Math.round(s.mau * s.seePct/100 * s.clickPct/100 * s.applyPct/100 * s.approvalPct/100) * 12;
  const annualGross = cardsYr * s.commission;
  const gcRev  = annualGross * s.gcSplit / 100;

  const fixedYr    = (s.teamCost + s.infraCost) * 12;
  const variablePerCard = s.callerCost + s.opsCost + s.hookCost;
  const variableYr = variablePerCard * cardsYr;
  const totalCost  = fixedYr + variableYr;
  const gcNet      = gcRev - totalCost;
  const unitPositive = gcNet >= 0;

  document.getElementById('revUnit').innerHTML = `
    <div class="space-y-2 text-[15px]">
      <div class="flex justify-between py-2 border-b border-slate-100">
        <span class="text-ink/80">GC gross revenue (at ${revInp('gcSplit', s.gcSplit, '%')} blended share)</span>
        <span class="font-semibold text-teal">${inrCr(gcRev)}/yr</span>
      </div>
      <div class="pt-2 pb-1 text-[11px] uppercase tracking-wider font-semibold text-mute">Fixed monthly costs</div>
      <div class="flex justify-between py-1.5 border-b border-slate-100">
        <span class="text-ink/80">Team (callers + PM + ops)</span>
        <span>₹${revInp('teamCost', s.teamCost, '', '7ch')}/mo</span>
      </div>
      <div class="flex justify-between py-1.5 border-b border-slate-100">
        <span class="text-ink/80">Infra + API</span>
        <span>₹${revInp('infraCost', s.infraCost, '', '6ch')}/mo</span>
      </div>
      <div class="pt-2 pb-1 text-[11px] uppercase tracking-wider font-semibold text-mute">Variable per card</div>
      <div class="flex justify-between py-1.5 border-b border-slate-100">
        <span class="text-ink/80">Caller cost</span>
        <span>₹${revInp('callerCost', s.callerCost, '')}/card</span>
      </div>
      <div class="flex justify-between py-1.5 border-b border-slate-100">
        <span class="text-ink/80">Ops</span>
        <span>₹${revInp('opsCost', s.opsCost, '')}/card</span>
      </div>
      <div class="flex justify-between py-1.5 border-b border-slate-100">
        <span class="text-ink/80">Hook funding (blended)</span>
        <span>₹${revInp('hookCost', s.hookCost, '')}/card</span>
      </div>
      <div class="flex justify-between py-2 border-b border-slate-100">
        <span class="text-ink/80">GC total cost / year</span>
        <span class="font-semibold">${inrCr(totalCost)}</span>
      </div>
      <div class="flex justify-between py-3 border-t-2 border-ink/20 mt-2">
        <span class="text-ink font-semibold">GC net / year</span>
        <span class="font-bold text-[20px] ${unitPositive ? 'text-teal' : 'text-red'}">${inrCr(gcNet)}</span>
      </div>
      <div class="rounded-lg px-4 py-3 mt-2 ${unitPositive ? 'bg-teal/10 text-teal' : 'bg-red/10 text-red'} text-[13px] font-semibold">
        ${unitPositive
          ? '✓ Unit positive at these inputs — GC makes money on every card.'
          : '✗ Below unit. Fixed costs exceed GC share of revenue. Lever to pull: negotiate higher GC split, drop hook funding, or grow cards/month.'}
      </div>
    </div>
  `;

  document.querySelectorAll('#revUnit .inp').forEach(inp => {
    inp.addEventListener('input', () => {
      revState[inp.dataset.rev] = parseFloat(inp.value) || 0;
      renderRevUnit();
    });
  });
}

function mountDeck() {}

// ═════════════════════════════════════════════════════════════════════════════
// Boot
// ═════════════════════════════════════════════════════════════════════════════

(async function boot() {
  updateApiStatus();
  await loadInitBundle();
  route();
})();
