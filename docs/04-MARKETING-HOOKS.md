# Marketing Hooks — Sell Hard

**Purpose:** the user's directive was "sell hard." This doc is the hook library. Each hook is a sharp consumer promise with unit economics exposed so we can pick the ones that pencil out.

**Baseline to beat:** cold CC recommendation converts at ~3%. Any hook that costs us <₹500/card and lifts conversion ≥1.5× is a keep. Any hook that lifts ≥3× without breaking unit economics is a must-have.

**The gross commission to play with:** ₹2,000/card from bank to GC. Everything below is funded out of this envelope. Whatever is left after hook cost + ops cost is what we split with Fibe.

---

## The 12 hooks

### Hook 1 — "One EMI on us"

```
Promise        Take this card, swipe ₹10K+ in 30 days. We pay your next loan EMI — up to ₹1,500.
Cohort         Approved + loan taken (≤90d since disbursement)
Mechanic       On spend milestone met, we credit ₹1,500 to user's Fibe EMI account.
Cost per card  ₹1,500 per converted card. Cap: only if spend milestone hit (est. 70%).
               Effective cost: ₹1,050 / card.
Conversion     Baseline 5% → estimated 12–15% (EMI reimbursement is a massive unlock
               for a salaried user on an active loan)
Envelope       ₹2,000 − ₹1,050 = ₹950 left per card to split with Fibe
Why it works   Loan + card cross-sell in one motion. User feels like Fibe is paying
               them to take the card. Real promise: their next EMI is literally free.
Risk           Abuse risk low (card must be approved + active + spend threshold)
Implementation Bank issues statement credit via promo code; GC reimburses Fibe's EMI
               account on back-end via monthly reconciliation.
```

### Hook 2 — "Play & Win: Your free card"

```
Promise        Play Slash-the-Fruits with 500 FibeCoins. Every win = one free card unlock.
               Win 3 in a row → we waive joining fee forever on the card of your choice.
Cohort         Rewards-engaged users (Media 3 — existing Play & Win players)
Mechanic       Game already exists. We plug GC LTF-card unlock into the reward rail.
Cost per card  ₹299–₹750 joining fee waiver (LTF cards are zero anyway; this is for
               first-year-waivable cards).
               Effective cost: ₹0–₹500 / card depending on product.
Conversion     Gamified funnels convert 3–8× vs cold on engaged cohorts.
               Expected: 1.5% of 500K monthly rewards players = 7,500 cards/month.
Envelope       ₹2,000 − ₹400 avg = ₹1,600 left per card
Why it works   It's already Fibe's happy place. Users are in reward mode, not
               sales mode. Cards feel earned, not sold.
Risk           Low. Fibe already owns the game surface.
Implementation Media 3 game → win event → webview showing 3 LTF card picks.
```

### Hook 3 — "Lifetime free, ₹500 in your pocket"

```
Promise        Zero joining fee. Zero annual fee. ₹500 cashback on first spend of ₹1,000.
Cohort         Registered + PAN, no loan, no card
Mechanic       LTF-card catalog with signup-bonus structure (Axis Ace, SBI SimplyClick,
               HDFC MoneyBack+ — all have this).
Cost per card  ₹500 bonus is bank-funded, not GC-funded. Zero cost to us.
Conversion     Baseline 2% → estimated 5–7% (LTF + positive delta = safest possible
               conversion hook for a CC-curious user)
Envelope       Full ₹2,000 preserved
Why it works   Removes every objection a first-time card user has. No fee, no
               commitment, they're already ₹500 ahead on day 1.
Risk           None. Bank-funded.
Implementation Filter catalog to LTF + signup-bonus, surface first.
```

### Hook 4 — "Your credit score just unlocked three cards"

```
Promise        Score crossed 750? Three new premium cards are now within reach.
               HDFC Regalia Gold. SBI Elite. Amex Travel. Pre-eligibility checked.
Cohort         Credit Score widget users who just upgraded buckets (650→750, 750→800)
Mechanic       Bucket-change event → push + email + inline unlock card on the score page
Cost per card  Zero. It's a trigger, not a promo.
Conversion     Baseline 0.5% → estimated 3–4% (moment-of-pride + "you earned this" framing)
Envelope       Full ₹2,000 preserved
Why it works   This is Fibe's dormant top-of-funnel. 500K users view the score widget
               monthly. Almost none of them get a card recommendation today.
Risk           None.
Implementation Score-bucket change event on Fibe side → webhook → GC renders unlock UI.
```

### Hook 5 — "Take the card that already knows you"

```
Promise        Based on your last 6 EMIs and your Fibe spend pattern, this one card
               saves you ₹38,000 over 12 months. Personalised.
Cohort         Active borrower with ≥3 EMIs paid, high engagement
Mechanic       Spend-based /calculate with Fibe's transaction category signals
               (Phase 3 data opt-in — see business plan).
Cost per card  Zero incremental; engine already exists.
Conversion     Baseline 3% → estimated 7–10% (specificity = trust)
Envelope       Full ₹2,000 preserved
Why it works   Every CC banner says "save ₹X". This one says "YOU save ₹X" with receipts.
Risk           Phase 3 data opt-in must be live. Phase 1+2 use proxy signals (loan amount,
               pincode, declared purpose). Savings number must be auditable.
Implementation /calculate endpoint already returns this. Surface it prominently.
```

### Hook 6 — "Card + loan combo: save on both"

```
Promise        Take any loan + this card together. We waive the loan processing fee
               AND give you ₹750 off the joining fee. Combo-only.
Cohort         Approved-but-not-yet-disbursed loan applicants
Mechanic       Combo SKU at loan-decision screen. Single checkout for both.
Cost per card  ₹750 joining fee waiver (variable by card). Loan fee waiver is Fibe cost.
               GC cost: ₹500 avg per converted card.
Conversion     Baseline 5% (post-approval) → estimated 12%+ (checkout moment, priced bundle)
Envelope       ₹2,000 − ₹500 = ₹1,500 left
Why it works   Right-time, right-moment, priced bundle. Highest-intent moment in funnel.
Risk           Ops complexity — two products in one checkout. Mitigate with webview
               stepper, not single-page.
Implementation Post-approval screen → "Add a card?" toggle → show 1 pre-matched card.
```

### Hook 7 — "Graduate: FD-backed → unsecured in 6 months"

```
Promise        Start with a FIRST EARN card (FD-backed). Make 6 on-time payments.
               Unlock HDFC Millennia, unsecured. We handle the upgrade path.
Cohort         Credit-builder / rejected-low-score cohort (who have liquid ₹10K)
Mechanic       FD card issued via IDFC or AU Small Finance.
               After 6 months clean → automatic pre-approval with second bank, unsecured.
Cost per card  ₹2,000 (two commissions — one for FD card, one for unsecured upgrade).
               Effective: we earn twice on the same user.
Conversion     Rejected cohort baseline 0.5% → estimated 2% (empowering narrative, ladder up)
Envelope       ₹4,000 total over 12 months per converted user
Why it works   The ONLY honest rejected-cohort play. Doesn't pretend they're approved
               for an unsecured card today. Gives them a 6-month path.
Risk           6-month delivery risk. If unsecured upgrade doesn't materialise,
               trust breaks. Mitigate with signed MOU with partner bank upfront.
Implementation Rejected-low-score cohort → credit-builder webview → FD card pick →
               calendar hook at T+6mo for unsecured upgrade.
```

### Hook 8 — "Refer 3, earn ₹3,000"

```
Promise        Refer 3 friends who get a card. ₹1,000 per approved card. ₹3,000 on 3.
Cohort         Any user who already has a card via Fibe
Mechanic       Referral code in user's app. Tracked via Fibe user hash.
Cost per card  ₹1,000 cash payout per referral approved.
               We still net ₹1,000 / card on referral flow. Unit positive.
Conversion     New-user referral baseline 1% → estimated 4–6% (friend-of-friend trust)
Envelope       ₹2,000 − ₹1,000 = ₹1,000 left
Why it works   Compounds. Every converted user becomes a distributor.
               Also the only hook with zero top-of-funnel cost.
Risk           Fraud risk. Requires KYC + spend milestone to unlock payout.
Implementation Referral code generated on first card approval. Track via UTM + hash.
```

### Hook 9 — "Match your salary, match your card"

```
Promise        Your salary just crossed ₹1L. You're in premium territory. Take
               the card salaried-people-at-your-level actually use.
Cohort         B2B financial wellness users whose salary data crosses thresholds
               (₹50K, ₹1L, ₹2L)
Mechanic       Salary-verified threshold event → tier-matched card reco
Cost per card  Zero.
Conversion     Baseline 3% → estimated 6–8%
Envelope       Full ₹2,000 preserved
Why it works   Identity-based framing. "This is what your peers use" is one of
               the strongest CC motivators.
Risk           None.
Implementation Salary-threshold event (Fibe already has) → push + inline surface.
```

### Hook 10 — "0% EMI on everything you already buy"

```
Promise        Take this card, get 0% EMI on 10K+ partner merchants — phones,
               electronics, insurance, education.
Cohort         EMI-mindset users (current borrowers, repayment-screen visitors)
Mechanic       Standard no-cost EMI cards (HDFC, Axis, Bajaj cards all qualify).
Cost per card  Zero.
Conversion     Baseline 4% → estimated 9% (explicit benefit for EMI-active user)
Envelope       Full ₹2,000 preserved
Why it works   User is already financing. Shifting financing to a credit card is
               lateral — no new behaviour to learn.
Risk           None.
Implementation Repayment screen (existing in demo) → EMI-card-first ranking.
```

### Hook 11 — "1 lakh points in month 1"

```
Promise        Take this card, spend ₹50K in 30 days, get 1 lakh reward points.
               Worth ₹25,000 in flights, electronics, gift cards.
Cohort         High-income (≥₹1L/mo) disbursed-loan users
Mechanic       Standard premium-card signup bonuses (HDFC Regalia, Axis Magnus,
               Amex Platinum Travel all run these).
Cost per card  Zero — bank-funded, not GC-funded.
Conversion     Baseline 5% → estimated 15% (premium cohort responds to big numbers)
Envelope       Full ₹2,000 preserved
Why it works   Premium users are motivated by earnings, not savings. Huge numbers
               break through banner fatigue.
Risk           Spend threshold must be realistic for the income band. ₹50K on ₹1L salary
               is tight; ₹50K on ₹3L+ salary is trivial.
Implementation Income-band filter → premium-card-with-bonus sort.
```

### Hook 12 — "Pay your first EMI with card rewards"

```
Promise        Use this card for 3 months. The rewards you earn pay your 4th EMI.
               Real math: ₹40K/mo spend × 2% rewards = ₹800/mo × 3 = ₹2,400 → EMI paid.
Cohort         Approved + loan active, monthly spend ≥ ₹30K (declared or inferred)
Mechanic       Education-first framing. No direct promo cost to us.
Cost per card  Zero (bank-funded rewards).
Conversion     Baseline 5% → estimated 8–10%
Envelope       Full ₹2,000 preserved
Why it works   Makes the math visible. Frames card as a tool, not a product.
Risk           None — we're explaining bank-funded rewards, not promising anything ourselves.
Implementation Content hook on Post-disbursal + Repayment screens.
```

---

## Hook stacking — how we actually deploy

Not all hooks run at once per cohort. The stack by cohort:

```
Registered, no PAN          H3 (LTF ₹500), H4 (score unlock teaser), H9 (salary match)
Registered, PAN, no loan    H3, H11 (if income ≥1L), H8 (referral — if they have friends
                               who are Fibe users)
In-Journey                  — (silent)
Approved, loan taken        H1 (EMI on us — anchor), H10 (0% EMI), H12 (rewards-pay-EMI),
                            H5 (personalised — Phase 3)
Approved, no loan           H3, H11, H6
Rejected, FD holder         H7 (FD ladder — anchor)
Rejected, salvageable       H7 (credit-builder) — the ONLY sell
Rejected, suppress          — (no sell, email only on re-apply reminder)
Rewards-engaged             H2 (Play & Win) — anchor
Credit-widget users         H4 (score unlock) — anchor
```

## Unit economics summary — per-hook envelope available to split with Fibe

```
Hook                      Our cost/card    Envelope after cost    Fibe-share range
─────────────────────    ─────────────    ───────────────────    ─────────────────
H1 EMI on us              ₹1,050           ₹950                   Fibe takes ₹0–₹700
H2 Play & Win             ₹400             ₹1,600                 Fibe takes ₹0–₹1,200
H3 LTF + bonus            ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H4 Score unlock           ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H5 Personalised           ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H6 Combo                  ₹500             ₹1,500                 Fibe takes ₹0–₹1,100
H7 FD → unsecured         ₹0 (dual ₹2K)    ₹4,000 over 12mo       Fibe takes ₹0–₹3,000
H8 Referral               ₹1,000           ₹1,000                 Fibe takes ₹0–₹700
H9 Salary match           ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H10 0% EMI                ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H11 1L points             ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
H12 Rewards-pay-EMI       ₹0               ₹2,000                 Fibe takes ₹0–₹1,500
```

## What each hook could contribute — illustrative upper bounds only

**These are not forecasts.** They are the maximum contribution of each hook if every cohort fires at aggressive conversion. The whole-funnel "928K cards / year" number that lived here earlier was unrealistic — Paisabazaar peaks at ~80–100K cards/year and the entire Indian aggregator market is ~8–10 lakh cards/year.

For honest volume and revenue planning, use `06-REVENUE-MODEL-VARIABLES.md`. The hook table there lets peers set per-cohort conv independently and compute total-cards-from-this-hook live.

Use this list as a shopping menu: pick 3 hooks for Phase 1, not all 12.

## Which hooks to pilot first — 3-hook Phase 1 stack

```
H4 — Score unlock           (zero-cost, biggest dormant cohort)
H3 — LTF + bonus            (zero-cost, broadest appeal)
H1 — EMI on us              (highest-conversion, high-intent cohort)
```

Why these three: two cost GC ₹0/card (H3, H4) so they guarantee unit-positive at any Fibe share; H1 is the conversion anchor for the Approved+loan cohort (estimated 12–15% vs 5% baseline) and still leaves ₹950/card envelope after its ₹1,050 effective cost. Volume and revenue output for this stack is computed in `06-REVENUE-MODEL-VARIABLES.md` against leadership-locked cohort reach and conversion assumptions — no pre-committed card or revenue figure lives here.

## What to measure per hook

Every hook has four KPIs:

```
1. Impression → tap rate        (is the hook catchy?)
2. Tap → application rate       (did we mis-price expectations?)
3. Application → approval rate  (is the eligibility engine tight?)
4. Approval → spend milestone   (for hooks that require milestone — H1, H6, H8)
```

Kill a hook if tap rate < 1% after 10K impressions, or if approval rate < 30% after 1,000 applications.

## What we never promise

```
× Cashback we can't deliver. If bank cuts the signup bonus, hook is pulled same day.
× Approval we can't guarantee. Every hook is paired with eligibility-pre-filter.
× "Guaranteed approval" language. Ever. Regulatory red line.
× Benefits tied to future Fibe product that may not exist. (e.g. "you'll get a
   Fibe-exclusive tier" — no tiered product exists today).
× EMI-on-us to users who can't actually hold a balance. H1 gated to approved-
   loan + spend-milestone.
```
