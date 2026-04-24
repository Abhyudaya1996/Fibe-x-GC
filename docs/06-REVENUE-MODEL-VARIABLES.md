# Revenue Model — Variable Framework

**Purpose:** replace every static revenue projection in the docs with a variable model. Abhyudaya and peers plug in their own numbers; the sheet recomputes. No "₹55cr base / ₹90cr stretch" claims anywhere in the final pitch — only the calculator and benchmark ranges.

**Why:** 928K cards/year was unrealistic. Paisabazaar ships ~80–100K cards/year at peak. BankBazaar similar. The entire Indian digital-CC-aggregator market is ~8–10 lakh cards/year across all players combined. Fibe as one partner will not exceed the full market.

---

## Benchmark ranges — for sanity checking inputs

```
Industry reference points (reported / modeled):

Paisabazaar                 ~80–100K CC / year (at scale, multi-year)
BankBazaar                  ~60–90K CC / year
Bajaj Markets               ~40–70K CC / year
OneCard + fintech aggregators combined  ~150–200K CC / year

Total Indian digital CC aggregator market        ~8–10 lakh / year
Organic bank websites (HDFC/Axis/SBI direct)     ~60–70% of all CC acquisition

Fibe's realistic share as a new entrant:
  Year 1   20,000 – 60,000 cards
  Year 2   50,000 – 1,20,000 cards
  Year 3   80,000 – 2,00,000 cards
```

Any input that projects Year 1 above 80K cards needs an explicit reason. Any above 150K should be challenged.

---

## The variable model

### Inputs — all editable

```
INPUT                                      Variable          Default    Range
─────────────────────────────────────     ──────────        ────────   ─────────────
Monthly disbursals                         M_disbursal       300,000    200K–400K
Monthly approved-no-loan                   M_approved_noL    30,000     20K–50K
Monthly rejected-salvageable               M_rejected_sal    180,000    100K–250K
Monthly credit-score widget users          M_score           500,000    200K–800K
Monthly rewards-engaged players            M_rewards         500,000    200K–800K
Monthly registered, PAN given, no loan     M_reg_pan         200,000    100K–300K
Monthly Fibe-FD-holder rejected on loan    M_fd_rejected     50,000     20K–80K
Monthly B2B salary-change events           M_b2b             100,000    50K–200K

Conversion rate by cohort
  Approved + loan taken                   C_approved         3%         1%–8%
  Approved, no loan                       C_approved_noL     2%         0.5%–5%
  Rejected salvageable                    C_rejected         0.5%       0.1%–2%
  Credit-widget                           C_score            0.5%       0.1%–2%
  Rewards-engaged (game-gated)            C_rewards          1.5%       0.3%–3%
  Reg + PAN                                C_reg_pan         3%         1%–6%
  Rejected FD holder                      C_fd               4%         1%–8%
  B2B salary change                       C_b2b              6%         2%–10%

Commission per card (blended)              Comm_per_card     ₹2,000     ₹1,500–₹3,000

Revenue share — passive placement default  Fibe_share_pct    80%        60%–90%
                                           GC_share_pct      20%        10%–40%

  See §9 of 03-BUSINESS-PLAN-FIBE.md for cohort-tiered splits:
    Passive placements           Fibe 80% / GC 20%  (default here)
    Hook-funded (EMI, Combo)     Fibe 70% / GC 30%
    AI-called leads              Fibe 60% / GC 40%
    Rejected FD-holder           Fibe 50% / GC 50%
    Referral                     Fibe 90% / GC 10%
  Blended base-case: ~Fibe 72% / GC 28%

GC cost per card (ops + infra)             GC_cost_fixed     ₹150       ₹100–₹300
Hook funding per card (blended)            Hook_cost_blend   ₹400       ₹0–₹1,050
```

### Formulas

```
Cards_monthly =
    M_disbursal      × C_approved
  + M_approved_noL   × C_approved_noL
  + M_rejected_sal   × C_rejected
  + M_score          × C_score
  + M_rewards        × C_rewards
  + M_reg_pan        × C_reg_pan
  + M_fd_rejected    × C_fd
  + M_b2b            × C_b2b

Cards_annual       = Cards_monthly × 12
Gross_revenue      = Cards_annual × Comm_per_card

Fibe_revenue       = Gross_revenue × Fibe_share_pct
GC_gross_revenue   = Gross_revenue × GC_share_pct
GC_total_cost      = Cards_annual × (GC_cost_fixed + Hook_cost_blend)
GC_net_revenue     = GC_gross_revenue − GC_total_cost

Unit_positive      = GC_net_revenue > 0   (hard pass/fail gate)
GC_margin_pct      = GC_net_revenue / GC_gross_revenue
```

### Three scenario presets — run these first, then customise

#### Preset 1 — Conservative (Year 1, pilot-level reach)

Only 3 placements live (Credit-score anchor + Trending tile + Post-disbursal), no AI calling.

```
M_disbursal=300K  C_approved=2%           → 6,000/mo
M_score=500K      C_score=0.3%            → 1,500/mo
M_reg_pan=200K    C_reg_pan=1.5%          → 3,000/mo
Other cohorts: 0 (not yet activated)
─────────────────────────────────────────────────────
Cards_monthly = 10,500
Cards_annual  = 126,000    [within benchmark]
Gross         = ₹25.2 cr
```

#### Preset 2 — Balanced (Year 2, full placement suite)

All 8 placements live, AI calling ramped, 4 hooks deployed.

```
M_disbursal=300K    C_approved=5% (hook lift)        → 15,000/mo
M_approved_noL=30K  C_approved_noL=3%                 → 900/mo
M_score=500K        C_score=1.2%                      → 6,000/mo
M_reg_pan=200K      C_reg_pan=3.5%                    → 7,000/mo
M_rewards=500K      C_rewards=1%                      → 5,000/mo
M_fd_rejected=50K   C_fd=3%                           → 1,500/mo
M_rejected_sal=180K C_rejected=0.4%                   → 720/mo
M_b2b=100K          C_b2b=4%                          → 4,000/mo
─────────────────────────────────────────────────────
Cards_monthly = 40,120
Cards_annual  = 481,000     [aggressive — challenge the approved cohort conv]
Gross         = ₹96.2 cr
```

#### Preset 3 — Realistic (Year 2–3, benchmark-aligned)

Industry-realistic: Year 2 targets ~100K, Year 3 ~150K cards. Keep per-cohort conv conservative.

```
M_disbursal=300K    C_approved=2.5%                   → 7,500/mo
M_approved_noL=30K  C_approved_noL=2%                 → 600/mo
M_score=500K        C_score=0.5%                      → 2,500/mo
M_reg_pan=200K      C_reg_pan=2%                      → 4,000/mo
M_rewards=500K      C_rewards=0.5%                    → 2,500/mo
M_fd_rejected=50K   C_fd=2%                           → 1,000/mo
M_rejected_sal=180K C_rejected=0.2%                   → 360/mo
M_b2b=100K          C_b2b=3%                          → 3,000/mo
─────────────────────────────────────────────────────
Cards_monthly = 21,460
Cards_annual  = 258,000    [above top aggregator today; Year 3 feasible]
Gross         = ₹51.6 cr
```

---

## How the variables flow to GC net revenue — illustrative only

Run the formula with your own numbers. The table below is a sensitivity grid, not a forecast.

```
If Cards_annual = 120K, Comm = ₹2,000, Hook cost = ₹400, Fixed = ₹150:

Gross_revenue = ₹24 cr
GC_total_cost = 120K × ₹550 = ₹6.6 cr

Split          Fibe_rev     GC_gross     GC_net        Unit positive?
70/30          ₹16.8 cr     ₹7.2 cr      ₹0.6 cr       Yes, thin
60/40          ₹14.4 cr     ₹9.6 cr      ₹3.0 cr       Yes
50/50          ₹12.0 cr     ₹12.0 cr     ₹5.4 cr       Yes
80/20          ₹19.2 cr     ₹4.8 cr      −₹1.8 cr      NO — below unit
```

The 80/20 split only breaks even if hook cost drops below ₹250/card, meaning we'd deploy only zero-cost hooks (H3, H4, H5, H9, H10, H11, H12 — no EMI-on-us, no Play & Win, no referral).

---

## What Abhyudaya should do with this

```
1. Put the INPUT table into a Google Sheet / Excel.
2. Add the FORMULAS block as a second sheet.
3. Share with peers — get their inputs on:
   a. Realistic per-cohort conversion (your loan-ops team will know)
   b. Fibe's actual reach per cohort (only Fibe has these numbers)
   c. Hook cost appetite (how much Fibe is willing to co-fund H1, H2, H6)
   d. Acceptable split direction
4. Lock a scenario as "pitch default" before the meeting.
5. Keep the sheet live during the meeting — if Fibe pushes back on an
   assumption, change it on screen and show the new output.
```

---

## What to remove from other docs

```
[01-PROTOTYPE.md] §10 — remove ₹55cr base / ₹90cr stretch claims.
                        Reference this variable framework instead.

[02-DECK-CXO.md]  Slide 01, 02, 03, 11 — remove specific revenue claims.
                        Replace with "see revenue model — tunable."

[02-DECK-PM.md]   No revenue claims currently; unchanged.

[03-BUSINESS-PLAN-FIBE.md] §4.2 — remove the volumes-and-revenue table.
                        Reference this variable framework.

[03-BUSINESS-PLAN-INTERNAL.md] §2 — same; remove revenue assumptions,
                        replace with "see 06-REVENUE-MODEL-VARIABLES.md,
                        lock scenario at pitch-time."

[04-MARKETING-HOOKS.md] Aggressive funnel section — downgrade from
                        "if every hook lands" to "illustrative upper-bound
                        only; real targets live in the variable model."
```

**Rule for every doc:** no revenue number appears as a claim. Every revenue number is either (a) a benchmark, clearly labelled, or (b) an output of this calculator with its inputs visible.
