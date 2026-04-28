/* ═══════════════════════════════════════════════════════════════════════════
   prototype.js
   Powers §5 Notification matrix + §10 Revenue calculator on the single-scroll
   prototype page. Pure client-side logic, no API. All copy and variable ranges
   are sourced from docs/01-PROTOTYPE.md and docs/06-REVENUE-MODEL-VARIABLES.md.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── §5 Notification matrix ────────────────────────────────────────────── */

const COHORTS = {
  reg_nopan: {
    label: 'Registered, no PAN given',
    volume: '~50K / mo',
    channel: 'WhatsApp + app push',
    tone: 'Educational, low-pressure',
    rules: [
      'No card pushes until PAN is on file — eligibility cannot be run.',
      'Drive to Credit-Score widget (PAN capture moment).',
      'Max 1 touch per week. Hard stop on day 30 if still no PAN.'
    ],
    cadence: [
      { day: 'D1',  msg: 'Complete your credit profile in 2 mins — unlock free credit-score tracking.' },
      { day: 'D7',  msg: 'See what cards you qualify for — takes your PAN and 30 seconds. No impact on your score.' },
      { day: 'D14', msg: '1 in 3 Fibe users qualify for an LTF card. See yours after a quick PAN check.' },
      { day: 'D21', msg: 'Your credit health, on us. Start with a score check — PAN needed, nothing else.' },
      { day: 'D30', msg: 'Last nudge: add PAN to see your personalised card shelf. We won\'t ask again.' }
    ]
  },
  reg_pan: {
    label: 'Registered, PAN given, no loan applied',
    volume: '~200K / mo',
    channel: 'App push + in-app tile',
    tone: 'Confident, shelf-led',
    rules: [
      'Highest-conversion cohort — eligibility already runnable.',
      'Lead with Trending row tile + Tailor-made offers carousel.',
      'Rotate category angle (rewards → fuel → travel) every 7 days.'
    ],
    cadence: [
      { day: 'D1',  msg: 'You\'re pre-eligible for 4 credit cards. See them in your Fibe home.' },
      { day: 'D3',  msg: 'Zero joining fee this week: HDFC Millennia, Axis ACE, SBI SimplyClick.' },
      { day: 'D7',  msg: 'Spend ₹20K/mo on fuel? This card gives you ₹400 back. Eligibility ✓' },
      { day: 'D14', msg: 'Premium travel card — 10K bonus miles, pre-approved for your profile.' },
      { day: 'D30', msg: 'Your card shelf was refreshed. 3 new offers match your profile — tap to view.' }
    ]
  },
  in_journey: {
    label: 'In-Journey (loan application in progress)',
    volume: '~80K / mo',
    channel: 'Silent — zero touches',
    tone: '—',
    rules: [
      'Do not disturb. User is mid-funnel for the primary product (loan).',
      'Zero card pushes across all channels until journey completes or aborts.',
      'Card surfaces hidden from home tile for this cohort.'
    ],
    cadence: [
      { day: 'D1',  msg: '— no message —' },
      { day: 'D3',  msg: '— no message —' },
      { day: 'D7',  msg: '— no message —' },
      { day: 'D14', msg: '— no message —' },
      { day: 'D30', msg: '— no message —' }
    ]
  },
  approved: {
    label: 'Approved + loan taken',
    volume: '~300K / mo',
    channel: 'App push + post-disbursal screen + email',
    tone: 'Celebratory, momentum-led',
    rules: [
      'Post-disbursal is the highest-intent moment — strike on D1.',
      'AI calling team can ring high-spend segments on D3.',
      'EMI-on-us hook (H1) available for fuel/grocery cards.'
    ],
    cadence: [
      { day: 'D1',  msg: '🎉 Loan disbursed. As a Fibe member, you\'re pre-approved for 3 top cards — skip the queue.' },
      { day: 'D3',  msg: 'First EMI on us — apply for HDFC Millennia this week and we\'ll credit ₹1,500 back.' },
      { day: 'D7',  msg: 'Your spends qualify you for a rewards card that pays back ~₹18K/yr. See the math.' },
      { day: 'D14', msg: '1.2M Fibe users picked up a card after their loan. You\'re eligible for 4. 2 taps to apply.' },
      { day: 'D30', msg: 'Your approval window is open — premium travel card at zero joining fee for 72 hours.' }
    ]
  },
  approved_nol: {
    label: 'Approved, no loan taken',
    volume: '~30K / mo',
    channel: 'WhatsApp + app push',
    tone: 'Soft, alternative-framed',
    rules: [
      'User declined loan — respect the signal. No loan pushbacks.',
      'Reframe: "since you\'re eligible, the same approval unlocks a card."',
      '1 touch per week, max 4 weeks.'
    ],
    cadence: [
      { day: 'D1',  msg: 'Changed your mind on the loan? Your approval still unlocks a zero-fee credit card.' },
      { day: 'D7',  msg: 'No pressure on the loan. But your credit profile qualifies for these 3 cards:' },
      { day: 'D14', msg: 'If cash isn\'t the answer, a rewards card might be. You\'re pre-eligible for 4.' },
      { day: 'D21', msg: 'Last card nudge — premium LTF card open for your profile this week.' },
      { day: 'D30', msg: '— cooldown, no message —' }
    ]
  },
  rejected: {
    label: 'Rejected on loan (non-FD holder)',
    volume: '~180K / mo salvageable',
    channel: 'WhatsApp only, gentle',
    tone: 'Ladder-back, hopeful',
    rules: [
      'NEVER recommend FD-backed cards here — user is cash-strapped.',
      'Credit-builder narrative only. Self-employed-friendly cards where applicable.',
      'Max 3 touches in 30 days. Hard stop at D30.'
    ],
    cadence: [
      { day: 'D1',  msg: 'Loan didn\'t go through this time. Build your credit back up — we\'ll show you how.' },
      { day: 'D7',  msg: 'A credit-builder card can lift your score by 40+ points in 6 months. Self-employed-friendly options inside.' },
      { day: 'D14', msg: '— cooldown, no message —' },
      { day: 'D21', msg: 'Check your updated score — it may already be enough for a rewards card.' },
      { day: 'D30', msg: '— hard stop, no further messages —' }
    ]
  },
  rejected_fd: {
    label: 'Rejected on loan, has active Fibe FD',
    volume: '~5K / mo',
    channel: 'App push + AI call',
    tone: 'Premium, confident',
    rules: [
      'Strongest FD-backed-card cohort — user has liquid capital parked with Fibe.',
      'AI call on D3 — explain 90% credit-limit against FD, no KYC re-run.',
      'Zero-friction pitch: "use 20% of your FD as collateral, keep earning 9% p.a."'
    ],
    cadence: [
      { day: 'D1',  msg: 'Your Fibe FD unlocks a credit card with 90% limit against your deposit. FD keeps earning 9%.' },
      { day: 'D3',  msg: '📞 AI call: "2-min walkthrough of how your FD becomes a card — no KYC, no income proof."' },
      { day: 'D7',  msg: 'Pre-approved FD card · ₹5L limit unlocked instantly · apply in 60 seconds.' },
      { day: 'D14', msg: 'Still thinking? The FD stays yours — card is just an overlay. No change to your 9% interest.' },
      { day: 'D30', msg: 'Offer expires in 48 hrs — FD-card at zero joining fee, zero renewal.' }
    ]
  }
};

const DAYS = ['D1', 'D3', 'D7', 'D14', 'D30'];

let activeCohort = 'reg_nopan';
let activeDay = 0;

function renderCohort(id) {
  const c = COHORTS[id];
  if (!c) return;
  activeCohort = id;
  activeDay = 0;

  // tab state
  document.querySelectorAll('#cohortTabs .cohort-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cohort === id);
  });

  // meta
  const meta = document.getElementById('cohortMeta');
  if (meta) {
    meta.innerHTML = `
      <div class="bg-slate-50 rounded-xl p-3">
        <p class="text-[10px] font-label font-semibold text-mute uppercase tracking-wider">Volume</p>
        <p class="font-bold text-ink mt-1">${c.volume}</p>
      </div>
      <div class="bg-slate-50 rounded-xl p-3">
        <p class="text-[10px] font-label font-semibold text-mute uppercase tracking-wider">Channel</p>
        <p class="font-bold text-ink mt-1">${c.channel}</p>
      </div>
      <div class="bg-slate-50 rounded-xl p-3">
        <p class="text-[10px] font-label font-semibold text-mute uppercase tracking-wider">Tone</p>
        <p class="font-bold text-ink mt-1">${c.tone}</p>
      </div>
    `;
  }

  // cadence timeline — 5 dot-pills
  const timeline = document.getElementById('cadenceTimeline');
  if (timeline) {
    timeline.innerHTML = c.cadence.map((step, i) => {
      const silent = step.msg.includes('no message') || step.msg.includes('hard stop') || step.msg.includes('cooldown');
      const bg = silent ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white';
      return `
        <button onclick="selectDay(${i})" class="flex-1 flex flex-col items-center gap-1 group" data-day-idx="${i}">
          <span class="w-10 h-10 rounded-full ${bg} flex items-center justify-center font-bold text-xs group-hover:ring-4 group-hover:ring-primary/20 transition-all">${step.day}</span>
          <span class="text-[10px] text-mute font-medium">${silent ? 'silent' : 'message'}</span>
        </button>
      `;
    }).join('<div class="flex-shrink-0 w-4 h-px bg-slate-300"></div>');
  }

  // rules
  const rules = document.getElementById('cohortRules');
  if (rules) {
    rules.innerHTML = c.rules.map(r => `<li>${r}</li>`).join('');
  }

  selectDay(0);
}

function selectDay(idx) {
  activeDay = idx;
  const c = COHORTS[activeCohort];
  if (!c) return;
  const step = c.cadence[idx];
  const label = document.getElementById('sampleDayLabel');
  const msg = document.getElementById('sampleMessage');
  if (label) label.textContent = `${step.day} · sample message`;
  if (msg) {
    const silent = step.msg.includes('no message') || step.msg.includes('hard stop') || step.msg.includes('cooldown');
    msg.innerHTML = silent
      ? `<div class="flex items-center justify-center h-full text-mute italic text-sm">${step.msg}</div>`
      : `<div class="text-slate-800 leading-relaxed">${step.msg}</div>
         <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-mute font-label">Delivered via ${c.channel}</div>`;
  }
  // highlight active day dot
  document.querySelectorAll('[data-day-idx]').forEach(el => {
    const dot = el.querySelector('span');
    if (!dot) return;
    if (parseInt(el.dataset.dayIdx, 10) === idx) {
      el.classList.add('scale-110');
    } else {
      el.classList.remove('scale-110');
    }
  });
}

// Wire cohort tab clicks on load
function initNotificationMatrix() {
  const tabs = document.getElementById('cohortTabs');
  if (!tabs) return;
  tabs.querySelectorAll('.cohort-tab').forEach(btn => {
    btn.addEventListener('click', () => renderCohort(btn.dataset.cohort));
  });
  renderCohort('reg_nopan');
}

/* ─── §10 Revenue calculator ────────────────────────────────────────────── */

// All 20 inputs — sourced from 06-REVENUE-MODEL-VARIABLES.md
const CALC_INPUTS = [
  // reach
  { id: 'M_disbursal',     label: 'Monthly disbursals',                group: 'reach', def: 300000, min: 200000, max: 400000, step: 10000, fmt: 'n', basic: true },
  { id: 'M_approved_noL',  label: 'Approved, no loan taken / mo',      group: 'reach', def: 30000,  min: 20000,  max: 50000,  step: 2000,  fmt: 'n' },
  { id: 'M_rejected_sal',  label: 'Rejected-salvageable / mo',         group: 'reach', def: 180000, min: 100000, max: 250000, step: 10000, fmt: 'n' },
  { id: 'M_score',         label: 'Credit-score widget users / mo',    group: 'reach', def: 500000, min: 200000, max: 800000, step: 25000, fmt: 'n' },
  { id: 'M_rewards',       label: 'Rewards-engaged players / mo',      group: 'reach', def: 500000, min: 200000, max: 800000, step: 25000, fmt: 'n' },
  { id: 'M_reg_pan',       label: 'Registered + PAN, no loan / mo',    group: 'reach', def: 200000, min: 100000, max: 300000, step: 10000, fmt: 'n' },
  { id: 'M_fd_rejected',   label: 'FD-holder rejected on loan / mo',   group: 'reach', def: 50000,  min: 20000,  max: 80000,  step: 2000,  fmt: 'n' },
  { id: 'M_b2b',           label: 'B2B salary-change events / mo',     group: 'reach', def: 100000, min: 50000,  max: 200000, step: 5000,  fmt: 'n' },

  // conversion
  { id: 'C_approved',      label: 'Conv — Approved + loan',            group: 'conv',  def: 3,   min: 1,   max: 8,  step: 0.1, fmt: 'pct', basic: true },
  { id: 'C_approved_noL',  label: 'Conv — Approved, no loan',          group: 'conv',  def: 2,   min: 0.5, max: 5,  step: 0.1, fmt: 'pct' },
  { id: 'C_rejected',      label: 'Conv — Rejected salvageable',       group: 'conv',  def: 0.5, min: 0.1, max: 2,  step: 0.1, fmt: 'pct' },
  { id: 'C_score',         label: 'Conv — Credit-score widget',        group: 'conv',  def: 0.5, min: 0.1, max: 2,  step: 0.1, fmt: 'pct' },
  { id: 'C_rewards',       label: 'Conv — Rewards-engaged',            group: 'conv',  def: 1.5, min: 0.3, max: 3,  step: 0.1, fmt: 'pct' },
  { id: 'C_reg_pan',       label: 'Conv — Reg + PAN',                  group: 'conv',  def: 3,   min: 1,   max: 6,  step: 0.1, fmt: 'pct' },
  { id: 'C_fd',            label: 'Conv — Rejected FD holder',         group: 'conv',  def: 4,   min: 1,   max: 8,  step: 0.1, fmt: 'pct' },
  { id: 'C_b2b',           label: 'Conv — B2B salary change',          group: 'conv',  def: 6,   min: 2,   max: 10, step: 0.1, fmt: 'pct' },

  // economics
  { id: 'Comm_per_card',   label: 'Commission per card (blended)',     group: 'econ',  def: 2000, min: 1500, max: 3000, step: 50, fmt: 'rs', basic: true },
  { id: 'Fibe_share_pct',  label: 'Fibe rev-share %',                  group: 'econ',  def: 70,   min: 30,   max: 90,   step: 5,  fmt: 'pct', basic: true },
  { id: 'GC_cost_fixed',   label: 'GC cost / card (ops + infra)',      group: 'econ',  def: 150,  min: 100,  max: 300,  step: 10, fmt: 'rs', basic: true },
  { id: 'Hook_cost_blend', label: 'Hook funding / card (blended)',     group: 'econ',  def: 400,  min: 0,    max: 1050, step: 25, fmt: 'rs', basic: true }
];

const PRESETS = {
  conservative: {
    // Only 3 placements live, no AI calling
    M_disbursal: 300000,    C_approved: 2,
    M_approved_noL: 0,      C_approved_noL: 2,
    M_rejected_sal: 0,      C_rejected: 0.5,
    M_score: 500000,        C_score: 0.3,
    M_rewards: 0,           C_rewards: 1.5,
    M_reg_pan: 200000,      C_reg_pan: 1.5,
    M_fd_rejected: 0,       C_fd: 4,
    M_b2b: 0,               C_b2b: 6,
    Comm_per_card: 2000, Fibe_share_pct: 70, GC_cost_fixed: 150, Hook_cost_blend: 400
  },
  realistic: {
    // Year 2-3, benchmark-aligned
    M_disbursal: 300000,    C_approved: 2.5,
    M_approved_noL: 30000,  C_approved_noL: 2,
    M_rejected_sal: 180000, C_rejected: 0.2,
    M_score: 500000,        C_score: 0.5,
    M_rewards: 500000,      C_rewards: 0.5,
    M_reg_pan: 200000,      C_reg_pan: 2,
    M_fd_rejected: 50000,   C_fd: 2,
    M_b2b: 100000,          C_b2b: 3,
    Comm_per_card: 2000, Fibe_share_pct: 70, GC_cost_fixed: 150, Hook_cost_blend: 400
  },
  balanced: {
    // All 8 placements, AI ramped, 4 hooks live — aggressive
    M_disbursal: 300000,    C_approved: 5,
    M_approved_noL: 30000,  C_approved_noL: 3,
    M_rejected_sal: 180000, C_rejected: 0.4,
    M_score: 500000,        C_score: 1.2,
    M_rewards: 500000,      C_rewards: 1,
    M_reg_pan: 200000,      C_reg_pan: 3.5,
    M_fd_rejected: 50000,   C_fd: 3,
    M_b2b: 100000,          C_b2b: 4,
    Comm_per_card: 2000, Fibe_share_pct: 70, GC_cost_fixed: 150, Hook_cost_blend: 400
  }
};

const calcState = {};

function fmtNumber(n) {
  if (!isFinite(n)) return '—';
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `${(n / 100000).toFixed(2)} L`;
  if (n >= 1000)     return `${(n / 1000).toFixed(1)}K`;
  return Math.round(n).toLocaleString('en-IN');
}
function fmtRs(n) { return `₹${fmtNumber(n)}`; }
function fmtPct(n) { return `${n.toFixed(1)}%`; }

function formatValue(input) {
  const v = calcState[input.id];
  if (input.fmt === 'pct') return fmtPct(v);
  if (input.fmt === 'rs')  return `₹${v.toLocaleString('en-IN')}`;
  return fmtNumber(v);
}

function renderSliderRow(input) {
  return `
    <div class="calc-slider-row" data-input="${input.id}">
      <label for="slider_${input.id}">${input.label}</label>
      <output id="out_${input.id}">${formatValue(input)}</output>
      <input type="range" id="slider_${input.id}"
             min="${input.min}" max="${input.max}" step="${input.step}"
             value="${calcState[input.id]}">
    </div>
  `;
}

function buildCalculator() {
  // seed state with defaults
  CALC_INPUTS.forEach(i => { calcState[i.id] = i.def; });

  const basicEl = document.getElementById('calcBasicSliders');
  const advEl   = document.getElementById('calcAdvancedSliders');
  if (!basicEl || !advEl) return;

  basicEl.innerHTML = CALC_INPUTS.filter(i => i.basic).map(renderSliderRow).join('');
  advEl.innerHTML   = CALC_INPUTS.filter(i => !i.basic).map(renderSliderRow).join('');

  // wire listeners
  CALC_INPUTS.forEach(input => {
    const el = document.getElementById(`slider_${input.id}`);
    if (!el) return;
    el.addEventListener('input', () => {
      calcState[input.id] = parseFloat(el.value);
      const out = document.getElementById(`out_${input.id}`);
      if (out) out.textContent = formatValue(input);
      recompute();
    });
  });

  recompute();
}

function applyPresetValues(preset) {
  Object.keys(preset).forEach(k => {
    if (calcState[k] === undefined) return;
    calcState[k] = preset[k];
    const slider = document.getElementById(`slider_${k}`);
    if (slider) slider.value = preset[k];
    const out = document.getElementById(`out_${k}`);
    const input = CALC_INPUTS.find(i => i.id === k);
    if (out && input) out.textContent = formatValue(input);
  });
  recompute();
}

function loadPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  applyPresetValues(preset);
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(name));
  });
}

function toggleAdvanced() {
  const panel = document.getElementById('calcAdvancedSliders');
  const chev  = document.getElementById('advancedChevron');
  const label = document.getElementById('advancedLabel');
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');
  panel.classList.toggle('hidden');
  if (chev)  chev.textContent  = isHidden ? 'expand_less' : 'expand_more';
  if (label) label.textContent = isHidden ? 'Hide advanced inputs' : 'Show all 20 inputs';
}

function recompute() {
  const s = calcState;
  const pairs = [
    ['M_disbursal',    'C_approved'],
    ['M_approved_noL', 'C_approved_noL'],
    ['M_rejected_sal', 'C_rejected'],
    ['M_score',        'C_score'],
    ['M_rewards',      'C_rewards'],
    ['M_reg_pan',      'C_reg_pan'],
    ['M_fd_rejected',  'C_fd'],
    ['M_b2b',          'C_b2b']
  ];

  const cardsMonthly = pairs.reduce((sum, [m, c]) => sum + (s[m] * s[c] / 100), 0);
  const cardsAnnual  = cardsMonthly * 12;
  const gross        = cardsAnnual * s.Comm_per_card;
  const fibeRev      = gross * (s.Fibe_share_pct / 100);
  const gcGross      = gross * ((100 - s.Fibe_share_pct) / 100);
  const gcCost       = cardsAnnual * (s.GC_cost_fixed + s.Hook_cost_blend);
  const gcNet        = gcGross - gcCost;

  setText('out_cards_annual', fmtNumber(cardsAnnual));
  setText('out_gross',   fmtRs(gross));
  setText('out_fibe',    fmtRs(fibeRev));
  setText('out_gc_gross',fmtRs(gcGross));
  setText('out_gc_net',  fmtRs(gcNet));

  // benchmark badge
  const bench = document.getElementById('benchmarkBadge');
  if (bench) {
    let txt, cls;
    if (cardsAnnual < 80000) {
      txt = 'Within pilot band · below top aggregator'; cls = 'text-emerald-600';
    } else if (cardsAnnual < 150000) {
      txt = 'Benchmark band · matches Paisabazaar at peak'; cls = 'text-emerald-600';
    } else if (cardsAnnual < 300000) {
      txt = 'Above all aggregators · challenge conv rates'; cls = 'text-amber-600';
    } else {
      txt = 'Exceeds entire Indian aggregator market · unrealistic'; cls = 'text-red-600';
    }
    bench.textContent = txt;
    bench.className = `mt-2 text-[10px] font-semibold ${cls}`;
  }

  // unit-positive gate
  const unit = document.getElementById('unitBadge');
  if (unit) {
    if (gcNet > 0) {
      const margin = gcGross > 0 ? (gcNet / gcGross) * 100 : 0;
      unit.textContent = `UNIT POSITIVE · GC margin ${margin.toFixed(1)}%`;
      unit.className = 'rounded-xl p-4 text-center font-bold text-sm bg-emerald-50 text-emerald-700';
    } else {
      unit.textContent = 'BELOW UNIT · hook cost exceeds GC share — renegotiate split or cut hooks';
      unit.className = 'rounded-xl p-4 text-center font-bold text-sm bg-red-50 text-red-700';
    }
  }

  // color GC net
  const netEl = document.getElementById('out_gc_net');
  if (netEl) netEl.style.color = gcNet > 0 ? '#059669' : '#dc2626';
}

function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

/* ─── Bootstrap ─────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initNotificationMatrix();
  buildCalculator();
  // start on Conservative preset
  loadPreset('conservative');
});

// expose for inline onclicks
window.loadPreset = loadPreset;
window.toggleAdvanced = toggleAdvanced;
window.selectDay = selectDay;
