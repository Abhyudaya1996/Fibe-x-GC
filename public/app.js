/* ═══════════════════════════════════════════════════════
   Fibe × Great.Cards Demo — Frontend
   Partner token is NEVER in this file. All calls → /api/*
═══════════════════════════════════════════════════════ */

// ─── State ───────────────────────────────────────────────────────────────────

const state = {
  creditScore:    750,
  monthlyIncome:  65000,
  employmentType: 'salaried',
  pincode:        '400001',
  activeScreen:   'home',
  dirty: new Set(['home', 'rejection', 'thankyou', 'repayment', 'email']),
  bankMap: {},        // bank_id → bank name (populated from init bundle)
  initCards: [],      // full card list from init bundle
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SCREENS = ['home', 'rejection', 'thankyou', 'repayment', 'email'];

const FALLBACK_COPY = {
  home:      'Enter your spending to find cards matched for you.',
  rejection: 'We are working on bringing more card options to your pincode. Check back soon.',
  thankyou:  'No card recommendations available right now. Visit Great.Cards for full options.',
  repayment: 'Check back after your next EMI for card recommendations.',
  email:     'Explore all cards at great.cards',
};

// Loan purpose → spend fields (PRD §3.1)
const LOAN_PURPOSE_SPEND = {
  travel:    { flights_annual: 60000,  hotels_annual: 30000 },
  shopping:  { amazon_spends: 10000,   flipkart_spends: 8000 },
  medical:   { other_online_spends: 10000 },
  education: { school_fees: 15000 },
  home:      { other_offline_spends: 20000 },
  wedding:   { dining_or_going_out: 15000, other_offline_spends: 30000 },
  vehicle:   { fuel: 8000 },
};

// Category tiles (PRD §3.3)
const CATEGORIES = [
  { id: 'groceries',      label: 'Groceries',    icon: '🛒', bucketLabels: { low: '₹2K/mo', medium: '₹8K/mo', high: '₹18K/mo' }, spend: b => ({ grocery_spends_online: {low:2000,medium:8000,high:18000}[b] }) },
  { id: 'fuel',           label: 'Fuel',          icon: '⛽', bucketLabels: { low: '₹2K/mo', medium: '₹5K/mo', high: '₹10K/mo' }, spend: b => ({ fuel: {low:2000,medium:5000,high:10000}[b] }) },
  { id: 'online_shopping',label: 'Shopping',      icon: '🛍', bucketLabels: { low: '₹6K/mo', medium: '₹20K/mo', high: '₹50K/mo' }, spend: b => ({ amazon_spends: {low:3000,medium:10000,high:25000}[b], other_online_spends: {low:3000,medium:10000,high:25000}[b] }) },
  { id: 'food_delivery',  label: 'Food Delivery', icon: '🛵', bucketLabels: { low: '₹1.5K/mo', medium: '₹4K/mo', high: '₹8K/mo' }, spend: b => ({ online_food_ordering: {low:1500,medium:4000,high:8000}[b] }) },
  { id: 'dining',         label: 'Dining Out',    icon: '🍽', bucketLabels: { low: '₹2K/mo', medium: '₹6K/mo', high: '₹12K/mo' }, spend: b => ({ dining_or_going_out: {low:2000,medium:6000,high:12000}[b] }) },
  { id: 'travel',         label: 'Travel',        icon: '✈',  bucketLabels: { low: '₹60K/yr', medium: '₹1.6L/yr', high: '₹3L/yr' }, spend: b => ({ flights_annual: {low:30000,medium:80000,high:150000}[b], hotels_annual: {low:30000,medium:80000,high:150000}[b] }) },
  { id: 'utilities',      label: 'Bills',          icon: '⚡', bucketLabels: { low: '₹3K/mo', medium: '₹8K/mo', high: '₹16K/mo' }, spend: b => ({ electricity_bills: {low:1500,medium:4000,high:8000}[b], mobile_phone_bills: {low:1500,medium:4000,high:8000}[b] }) },
  { id: 'ott',            label: 'OTT / Subs',    icon: '📺', bucketLabels: { low: '₹500/mo', medium: '₹1K/mo', high: '₹2K/mo' }, spend: b => ({ other_online_spends: {low:500,medium:1000,high:2000}[b] }) },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bucketScore(score) {
  if (score <= 624) return 600;
  if (score <= 699) return 650;
  if (score <= 774) return 750;
  return 800;
}

function roundIncome(income) {
  return Math.round(income / 10000) * 10000;
}

function buildCalculateBody(overrides = {}) {
  // All fields required — send 0 where no spend (per API guide §2)
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

function buildEligibilityPayload() {
  return {
    pincode:      state.pincode,
    inhandIncome: String(state.monthlyIncome),
    empStatus:    state.employmentType,
  };
}

function buildRedirectUrl(nudge, purpose = null) {
  const p = new URLSearchParams({
    nudge,
    score_band:   String(bucketScore(state.creditScore)),
    income_band:  String(roundIncome(state.monthlyIncome)),
    emp:          state.employmentType,
    pin:          state.pincode,
    utm_source:   'fibe',
    utm_medium:   nudge + '_screen',
    utm_campaign: 'gc_fibe_q2_2026',
  });
  if (purpose) p.set('purpose', purpose);
  return 'https://tide.bankkaro.com/fibe?' + p.toString();
}

function fmt(n) { return Number(n || 0).toLocaleString('en-IN'); }

function bankName(bankId) {
  return state.bankMap[bankId] || '';
}

// ─── API calls ────────────────────────────────────────────────────────────────

async function apiPost(endpoint, body) {
  const res  = await fetch('/api/' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:   JSON.stringify(body),
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

// Load init bundle once → populate bankMap + initCards
async function loadInitBundle() {
  if (state.initLoaded) return;
  try {
    const data  = await apiGet('init');
    const inner = data?.data || {};

    // bank_data is an array of { id, name, logo }
    const banks = inner.bank_data || [];
    banks.forEach(b => { state.bankMap[b.id] = b.name; });

    state.initCards = inner.card_data || [];
    state.initLoaded = true;
  } catch (e) {
    console.warn('[Init] Could not load init bundle:', e.message);
  }
}

// ─── Card normalisation ───────────────────────────────────────────────────────
// Handles BOTH calculate response shape AND /cards/:alias detail shape.

function normalizeCalcCard(raw) {
  if (!raw) return null;

  const alias       = raw.seo_card_alias || raw.card_alias || raw.alias || '';
  const name        = (raw.card_name || raw.name || 'Credit Card').trim().slice(0, 30);
  const image       = raw.image || '';
  const bankId      = raw.bank_id;
  const bank        = bankId ? bankName(bankId) : (raw.bank_name || '');
  const joiningFee  = parseFloat(raw.joining_fees || 0);
  const annualFee   = parseFloat(raw.annual_fee || raw.annual_fee_text || raw.joining_fees || 0);
  const isLTF       = joiningFee === 0 && annualFee === 0;
  const netSavings  = parseFloat(raw.total_savings_yearly || raw.annual_saving || raw.net_annual_savings || 0);

  // product_usps is list of { header, description }
  const rawUsps = raw.product_usps || [];
  const topBenefits = rawUsps
    .filter(u => u.header)
    .map(u => u.header.trim())
    .filter(Boolean);

  const rawUrl      = raw.network_url || raw.cg_network_url || null;
  const applyUrl    = rawUrl ? rawUrl + 'AB' : null;

  return {
    alias, name, bank, image,
    annualFee: joiningFee > 0 ? joiningFee : annualFee,
    isLifetimeFree: isLTF,
    netSavings,
    topBenefits,
    eligibilityConfirmed: false,
    applyUrl,
  };
}

function normalizeDetailCard(raw) {
  if (!raw) return null;
  const name        = (raw.name || 'Credit Card').trim().slice(0, 30);
  const image       = raw.image || '';
  const annualFeeN  = parseFloat(raw.annual_fee_text || raw.joining_fee_text || 0);
  const isLTF       = annualFeeN === 0;
  const netSavings  = parseFloat(raw.annual_saving || 0);
  const banksField  = raw.banks;
  const bank        = (banksField && typeof banksField === 'object' && !Array.isArray(banksField))
    ? (banksField.cg_bank_name || banksField.name || '')
    : (Array.isArray(banksField) && banksField[0] ? banksField[0].name : '');

  const rawUsps     = raw.product_usps || [];
  const topBenefits = rawUsps
    .filter(u => u.header)
    .map(u => u.header.trim())
    .filter(Boolean);

  return {
    alias: raw.seo_card_alias || raw.card_alias || '',
    name, bank, image,
    annualFee: annualFeeN,
    isLifetimeFree: isLTF,
    netSavings,
    topBenefits,
    eligibilityConfirmed: false,
    applyUrl: null,
  };
}

// Extract savings array from /calculate response
// Real shape: data.data.savings  (data = raw API response)
function extractCalcCards(data) {
  if (!data) return [];
  const inner = data?.data?.data || data?.data || data;
  if (inner?.savings && Array.isArray(inner.savings)) return inner.savings;
  if (Array.isArray(inner))                             return inner;
  if (inner?.cards && Array.isArray(inner.cards))       return inner.cards;
  return [];
}

// Extract eligible aliases from /eligibility response
// Real shape: data.data  is an array of { card_alias, seo_card_alias, eligible }
function extractEligibleAliases(data) {
  if (!data) return [];
  const inner = data?.data?.data || data?.data || data;
  const items = Array.isArray(inner) ? inner : [];
  return items
    .filter(x => x.eligible !== false)
    .map(x => x.seo_card_alias || x.card_alias || x.alias)
    .filter(Boolean);
}

// ─── Card tile HTML ───────────────────────────────────────────────────────────

function cardTileHTML(card, nudge, { ctaText = 'Apply Now', showEligibility = false, purpose = null } = {}) {
  const url = card.applyUrl || buildRedirectUrl(nudge, purpose);

  const imgHTML = card.image
    ? `<img src="${card.image}" alt="${card.name}" class="card-img"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderHTML = `<div class="card-img-placeholder" ${card.image ? 'style="display:none"' : ''}>💳</div>`;

  const feeHTML = card.isLifetimeFree
    ? '<span class="badge badge-green">Lifetime Free</span>'
    : `<span class="annual-fee">Rs.${fmt(card.annualFee)}/year</span>`;

  const eligiBadge = (showEligibility || card.eligibilityConfirmed)
    ? '<span class="badge badge-orange">Likely approved</span>'
    : '';

  const savingsHTML = card.netSavings > 0
    ? `<div class="card-savings">Save Rs.${fmt(card.netSavings)}/year</div>`
    : '';

  const benefit = Array.isArray(card.topBenefits)
    ? (card.topBenefits[0] || '')
    : (typeof card.topBenefits === 'string' ? card.topBenefits : '');
  const benefitHTML = benefit ? `<div class="card-benefit">⭐ ${benefit}</div>` : '';

  return `
    <div class="card-tile" data-alias="${card.alias}">
      <div class="card-tile-inner">
        <div class="card-tile-header">
          <div class="card-img-wrap">${imgHTML}${placeholderHTML}</div>
          <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-bank">${card.bank}</div>
            <div class="card-fee-wrap">${feeHTML} ${eligiBadge}</div>
          </div>
        </div>
        ${savingsHTML}
        ${benefitHTML}
        <a href="${url}" target="_blank" class="btn-apply" onclick="event.stopPropagation()">${ctaText}</a>
      </div>
    </div>`;
}

function loadingHTML(msg = 'Finding the best cards for you…') {
  return `<div class="loading-state"><div class="spinner"></div><p>${msg}</p></div>`;
}

function fallbackHTML(screen) {
  return `<div class="fallback-state"><div class="fallback-icon">🃏</div><p>${FALLBACK_COPY[screen] || 'No recommendations available right now.'}</p></div>`;
}

// ─── Screen 1: Home ───────────────────────────────────────────────────────────

let homeSelectedCategories = {};

function initHomeScreen() {
  renderCategoryTiles();
  loadHomeColdStart();
}

function renderCategoryTiles() {
  const grid = document.getElementById('homeCategoryGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(cat => {
    const sel = homeSelectedCategories[cat.id];
    return `
      <div class="category-tile ${sel ? 'selected' : ''}" onclick="toggleCategory('${cat.id}')">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-label">${cat.label}</span>
        ${sel ? `
          <div class="bucket-selector" onclick="event.stopPropagation()">
            ${['low','medium','high'].map(b =>
              `<button class="bucket-btn ${sel===b?'active':''}"
                       onclick="setBucket('${cat.id}','${b}')">
                 <span class="bucket-label-text">${b[0].toUpperCase()+b.slice(1)}</span>
                 <span class="bucket-amount">${cat.bucketLabels[b]}</span>
               </button>`
            ).join('')}
          </div>` : ''}
      </div>`;
  }).join('');
}

function toggleCategory(catId) {
  if (homeSelectedCategories[catId]) delete homeSelectedCategories[catId];
  else homeSelectedCategories[catId] = 'medium';
  renderCategoryTiles();
  loadHomeCards();
}

function setBucket(catId, bucket) {
  homeSelectedCategories[catId] = bucket;
  renderCategoryTiles();
  loadHomeCards();
}

async function loadHomeColdStart() {
  const container = document.getElementById('homeCardsContainer');
  if (!container) return;
  container.innerHTML = loadingHTML('Loading top cards for you…');

  try {
    // Cold start: calculate with all-zero spend → ranked by overall reward potential
    const body = buildCalculateBody();
    const data = await apiPost('calculate', body);
    const raw  = extractCalcCards(data);

    if (!raw.length) { container.innerHTML = fallbackHTML('home'); return; }

    const cards = raw.slice(0, 3).map(normalizeCalcCard).filter(Boolean);
    renderHomeCards(cards, container);
  } catch (err) {
    console.error('[Home cold start]', err.message);
    container.innerHTML = fallbackHTML('home');
  }
}

async function loadHomeCards() {
  const container  = document.getElementById('homeCardsContainer');
  if (!container) return;

  const selectedIds = Object.keys(homeSelectedCategories);
  if (!selectedIds.length) { loadHomeColdStart(); return; }

  container.innerHTML = loadingHTML('Calculating your best cards…');

  let spendOverrides = {};
  selectedIds.forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) Object.assign(spendOverrides, cat.spend(homeSelectedCategories[catId]));
  });

  try {
    const data = await apiPost('calculate', buildCalculateBody(spendOverrides));
    const raw  = extractCalcCards(data);
    if (!raw.length) { container.innerHTML = fallbackHTML('home'); return; }

    const cards = raw.slice(0, 3).map(normalizeCalcCard).filter(Boolean);
    renderHomeCards(cards, container);
  } catch (err) {
    console.error('[Home calculate]', err.message);
    container.innerHTML = fallbackHTML('home');
  }
}

function renderHomeCards(cards, container) {
  if (!cards.length) { container.innerHTML = fallbackHTML('home'); return; }
  container.innerHTML = cards.map(c => cardTileHTML(c, 'homepage', { ctaText: 'Apply Now' })).join('');
  attachCardDetailListeners(container);
}

// ─── Screen 2: Rejection ──────────────────────────────────────────────────────

async function initRejectionScreen() {
  const container = document.getElementById('rejectionCardsContainer');
  if (!container) return;
  container.innerHTML = loadingHTML('Finding a card to help build your credit…');

  try {
    // Use calculate with zero spend to get all cards sorted by potential
    const data = await apiPost('calculate', buildCalculateBody());
    const raw  = extractCalcCards(data);

    // Filter for LTF cards (joining_fees == 0 or "0")
    const ltfCards = raw.filter(c => {
      const fee = parseFloat(c.joining_fees || 0);
      return fee === 0;
    });

    const pool    = ltfCards.length > 0 ? ltfCards : raw;
    const cardRaw = pool[0];
    if (!cardRaw) { container.innerHTML = fallbackHTML('rejection'); return; }

    const card = normalizeCalcCard(cardRaw);
    if (!card) { container.innerHTML = fallbackHTML('rejection'); return; }

    container.innerHTML = cardTileHTML(card, 'rejection', {
      showEligibility: true,
      ctaText: 'Apply Now',
    });
  } catch (err) {
    console.error('[Rejection]', err.message);
    container.innerHTML = fallbackHTML('rejection');
  }
}

// ─── Screen 3: Thank You ──────────────────────────────────────────────────────

let thankYouPurpose = 'travel';

function initThankYouScreen() {
  const sel = document.getElementById('loanPurposeSelect');
  if (sel) {
    sel.value = thankYouPurpose;
    sel.onchange = e => { thankYouPurpose = e.target.value; loadThankYouCards(); };
  }
  loadThankYouCards();
}

async function loadThankYouCards() {
  const container = document.getElementById('thankyouCardsContainer');
  if (!container) return;
  container.innerHTML = loadingHTML('Finding cards that match your goals…');

  try {
    const spendOverrides = LOAN_PURPOSE_SPEND[thankYouPurpose] || {};
    const calcBody       = buildCalculateBody(spendOverrides);

    const [calcData, eligiData] = await Promise.all([
      apiPost('calculate', calcBody),
      apiPost('eligibility', buildEligibilityPayload()),
    ]);

    let cards          = extractCalcCards(calcData).map(normalizeCalcCard).filter(Boolean);
    const eligiAliases = new Set(extractEligibleAliases(eligiData));

    if (eligiAliases.size > 0) {
      const filtered = cards.filter(c => eligiAliases.has(c.alias));
      if (filtered.length > 0) cards = filtered;
    }

    cards = cards.slice(0, 2).map(c => ({ ...c, eligibilityConfirmed: true }));

    if (!cards.length) { container.innerHTML = fallbackHTML('thankyou'); return; }

    container.innerHTML = cards.map(c => cardTileHTML(c, 'thankyou', {
      showEligibility: true,
      ctaText: 'Apply Now',
      purpose: thankYouPurpose,
    })).join('');
  } catch (err) {
    console.error('[ThankYou]', err.message);
    container.innerHTML = fallbackHTML('thankyou');
  }
}

// ─── Screen 4: Repayment ──────────────────────────────────────────────────────

async function initRepaymentScreen() {
  const container = document.getElementById('repaymentCardsContainer');
  if (!container) return;
  container.innerHTML = loadingHTML('Finding free cards for you…');

  try {
    const data = await apiPost('calculate', buildCalculateBody());
    const raw  = extractCalcCards(data);

    // Filter LTF, sort by total_savings_yearly desc
    const ltf = raw
      .filter(c => parseFloat(c.joining_fees || 0) === 0)
      .sort((a, b) => parseFloat(b.total_savings_yearly || 0) - parseFloat(a.total_savings_yearly || 0));

    const pool  = ltf.length > 0 ? ltf : raw;
    const cards = pool.slice(0, 2).map(normalizeCalcCard).filter(Boolean);

    if (!cards.length) { container.innerHTML = fallbackHTML('repayment'); return; }

    container.innerHTML = cards.map(c => cardTileHTML(c, 'repayment', {
      ctaText: 'Apply Now',
    })).join('');
  } catch (err) {
    console.error('[Repayment]', err.message);
    container.innerHTML = fallbackHTML('repayment');
  }
}

// ─── Screen 5: Email ──────────────────────────────────────────────────────────

async function initEmailScreen() {
  const container = document.getElementById('emailCardsContainer');
  if (!container) return;
  container.innerHTML = loadingHTML('Preparing email preview…');

  try {
    const body = buildCalculateBody(LOAN_PURPOSE_SPEND['travel']);
    const data = await apiPost('calculate', body);
    const raw  = extractCalcCards(data);

    if (!raw.length) { container.innerHTML = fallbackHTML('email'); return; }

    const cards = raw.slice(0, 2).map(normalizeCalcCard).filter(Boolean);

    container.innerHTML = cards.map(c => emailCardTileHTML(c)).join('') +
      `<a href="https://tide.bankkaro.com/fibe" target="_blank" class="btn-email-cta">Find my best card →</a>`;
  } catch (err) {
    console.error('[Email]', err.message);
    container.innerHTML = fallbackHTML('email');
  }
}

function emailCardTileHTML(card) {
  const feeText = card.isLifetimeFree ? 'Lifetime Free' : `Rs.${fmt(card.annualFee)}/year`;
  const benefit = Array.isArray(card.topBenefits) ? (card.topBenefits[0] || '') : '';
  const applyUrl = card.applyUrl || 'https://tide.bankkaro.com/fibe';
  return `
    <div class="email-card-tile">
      ${card.image ? `<img src="${card.image}" alt="${card.name}" class="email-card-img">` : ''}
      <div class="email-card-name">${card.name}</div>
      <div class="email-card-bank">${card.bank}</div>
      ${card.netSavings > 0 ? `<div class="email-card-savings">Save Rs.${fmt(card.netSavings)}/year</div>` : ''}
      <div class="email-card-fee">${feeText}</div>
      ${benefit ? `<div class="email-card-benefit">${benefit}</div>` : ''}
      <a href="${applyUrl}" target="_blank" class="btn-apply" style="margin-top:8px">Apply Now</a>
    </div>`;
}

// ─── Card Detail Modal ────────────────────────────────────────────────────────

function attachCardDetailListeners(container) {
  container.querySelectorAll('.card-tile').forEach(tile => {
    tile.addEventListener('click', e => {
      if (e.target.classList.contains('btn-apply') || e.target.closest('.btn-apply')) return;
      openCardDetail(tile.dataset.alias);
    });
  });
}

async function openCardDetail(alias) {
  if (!alias) return;
  const modal   = document.getElementById('cardDetailModal');
  const content = document.getElementById('modalContent');
  modal.classList.add('open');
  content.innerHTML = loadingHTML('Loading card details…');

  try {
    const data = await apiGet('cards/' + alias);
    // /cards/:alias → data.data (which is the raw API response with data.data = array)
    const rawList = data?.data?.data || (Array.isArray(data?.data) ? data.data : []);
    const raw     = Array.isArray(rawList) ? rawList[0] : rawList;
    if (!raw) throw new Error('Empty card detail response');

    const card     = normalizeDetailCard(raw);
    const benefits = (card.topBenefits || []).slice(0, 6);

    content.innerHTML = `
      <div class="card-detail">
        <div class="detail-header">
          <div class="card-img-wrap">
            ${card.image
              ? `<img src="${card.image}" alt="${card.name}" class="detail-img"
                      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                 <div class="card-img-placeholder detail-img" style="display:none">💳</div>`
              : `<div class="card-img-placeholder detail-img">💳</div>`}
          </div>
          <div>
            <div class="detail-name">${card.name}</div>
            <div class="detail-bank">${card.bank}</div>
            <div class="detail-fee">
              ${card.isLifetimeFree
                ? '<span class="badge badge-green">Lifetime Free</span>'
                : `Rs.${fmt(card.annualFee)}/year`}
            </div>
          </div>
        </div>
        ${card.netSavings > 0 ? `
          <div class="detail-savings-banner">
            💰 Save Rs.${fmt(card.netSavings)}/year with this card
          </div>` : ''}
        ${benefits.length ? `
          <div class="detail-benefits">
            <div class="detail-section-title">Key Benefits</div>
            ${benefits.map(b => `<div class="detail-benefit-item">✓ ${b}</div>`).join('')}
          </div>` : ''}
        <a href="${buildRedirectUrl('homepage')}" target="_blank" class="btn-apply btn-apply-large">
          Check approval odds
        </a>
      </div>`;
  } catch (err) {
    content.innerHTML = `<p class="error-text">Could not load card details. Please try again.</p>`;
    console.error('[Modal]', err.message);
  }
}

function closeModal(e) {
  if (e && e.target === document.getElementById('cardDetailModal')) {
    document.getElementById('cardDetailModal').classList.remove('open');
  }
}

function closeModalBtn() {
  document.getElementById('cardDetailModal').classList.remove('open');
}

// ─── Navigation (SPA page switching) ─────────────────────────────────────────

const PAGES = ['landing', 'home', 'rejection', 'thankyou', 'repayment', 'email'];

const SCREEN_INITS = {
  home:      initHomeScreen,
  rejection: initRejectionScreen,
  thankyou:  initThankYouScreen,
  repayment: initRepaymentScreen,
  email:     initEmailScreen,
};

function navigateTo(pageId) {
  // Hide all pages
  PAGES.forEach(id => {
    const el = document.getElementById('page-' + id);
    if (el) el.classList.add('hidden');
  });

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.remove('hidden');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Track active screen for dirty logic
  if (pageId !== 'landing') {
    state.activeScreen = pageId;
    // Init screen data if dirty
    if (state.dirty.has(pageId)) {
      state.dirty.delete(pageId);
      SCREEN_INITS[pageId]?.();
    }
  }
}

// ─── Controls Panel ──────────────────────────────────────────────────────────

function toggleControls() {
  const panel = document.getElementById('controlsPanel');
  if (panel) panel.classList.toggle('hidden');
}

function markAllDirty() {
  SCREENS.forEach(s => state.dirty.add(s));
  homeSelectedCategories = {};
  // Re-init the currently visible screen immediately
  state.dirty.delete(state.activeScreen);
  SCREEN_INITS[state.activeScreen]?.();
}

function applyControls() {
  const slider  = document.getElementById('ctrlScore');
  const income  = document.getElementById('ctrlIncome');
  const pincode = document.getElementById('ctrlPincode');
  const empBtns = document.querySelectorAll('.emp-btn');
  const BUCKETS = [600, 650, 750, 800];

  if (slider) {
    const raw = parseInt(slider.value, 10);
    state.creditScore = BUCKETS.reduce((p, c) => Math.abs(c - raw) < Math.abs(p - raw) ? c : p);
  }
  if (income) state.monthlyIncome = parseInt(income.value, 10) || 65000;
  if (pincode && /^\d{6}$/.test(pincode.value.trim())) state.pincode = pincode.value.trim();
  const activeEmp = document.querySelector('.emp-btn.active');
  if (activeEmp) state.employmentType = activeEmp.dataset.emp;

  markAllDirty();
}

function setupControlPanel() {
  const slider  = document.getElementById('ctrlScore');
  const display = document.getElementById('scoreDisplay');
  const empBtns = document.querySelectorAll('.emp-btn');
  const BUCKETS = [600, 650, 750, 800];

  if (slider) {
    slider.addEventListener('input', () => {
      const raw     = parseInt(slider.value, 10);
      const nearest = BUCKETS.reduce((p, c) => Math.abs(c - raw) < Math.abs(p - raw) ? c : p);
      slider.value      = nearest;
      if (display) display.textContent = nearest;
    });
    slider.value = state.creditScore;
    if (display) display.textContent = state.creditScore;
  }

  empBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      empBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ─── API status indicator ─────────────────────────────────────────────────────

async function checkApiStatus() {
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  try {
    const res  = await fetch('/api/status');
    const json = await res.json();
    if (json.ok) {
      if (dot) { dot.classList.remove('bg-yellow-400', 'animate-pulse', 'bg-red-400'); dot.classList.add('bg-green-400'); }
      if (text) text.textContent = 'API Ready';
    } else throw new Error();
  } catch {
    if (dot) { dot.classList.remove('bg-yellow-400', 'animate-pulse', 'bg-green-400'); dot.classList.add('bg-red-400'); }
    if (text) text.textContent = 'API Error';
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  setupControlPanel();
  checkApiStatus();
  await loadInitBundle();
  // Start on landing page
  navigateTo('landing');
});
