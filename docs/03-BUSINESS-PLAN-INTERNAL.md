# Business Plan — Internal (Great.Cards)

**Audience:** Great.Cards leadership (founders, head of partnerships, head of ops, CFO)
**Purpose:** What we build, what we invest, what we earn, what we risk — for internal approval.
**Confidence:** Revenue numbers modeled from Fibe's disclosed funnel (`USER-NOTES`). Costs are GC-side estimates. Treat as a Phase 0 plan; re-baseline at month 3.

---

## 1. Why this account, now

1. **Fibe has 9L active borrowers, CIBIL 700+ salaried prime.** Highest-quality cohort of any Indian lending-fintech we can reach commercially this year.
2. **Fibe is IPO-bound (₹1,500cr target, 2026 window).** They will show every line they can. A new revenue line matters to them right now.
3. **One co-branded card (Axis) is not enough product for their user base.** The gap is real and durable.
4. **The integration is small** — webview-only, 8 placements share one shell, zero PII. Lower ops burden than any current account.

## 2. Account-level P&L — dynamic model

**Revenue and volume are variable.** All inputs (cohort reach, conversion rate, commission, split, hook cost) live in `06-REVENUE-MODEL-VARIABLES.md`. This section does not claim a fixed revenue number — any scenario approved by GC leadership should reference a specific locked version of that file.

Realistic benchmarks to frame the discussion:

```
Paisabazaar peak       ~80–100K cards / year
BankBazaar peak        ~60–90K cards / year
Full Indian digital CC aggregator market  ~8–10 lakh cards / year

Fibe realistic share:
  Year 1   20K–60K cards
  Year 2   50K–1,20K cards
  Year 3   80K–2,00K cards
```

Leadership sign-off should be on a **range**, not a point estimate. The calculator produces both Fibe-side revenue and GC-side net (after cost + share) for any scenario.

### Cost structure (GC-side)

```
Item                              Yr 1 cost     Notes
───────────────────────────────   ──────────    ──────────────────────────────────
Integration engineer × 1          ₹30 L         2-week webview build + 3-month embed
Account manager × 1               ₹20 L         Fibe-dedicated
AI calling team ramp              ₹1.2 cr       ~15 agents dedicated, 18 months
  (fully loaded: salary + infra)
Content + creative                ₹15 L         One-time library + monthly refresh
Tech infra allocation             ₹40 L         Fibe-dedicated API quota, caching
Monitoring + reporting stack      ₹10 L
Legal / DPA / compliance          ₹8 L
Contingency                       ₹25 L
─────────────────────────────────────────────────────────────────────────────────
Year 1 total                      ~₹2.5 cr
```

### Revenue share — variable

Revenue share posture is variable — see `06-REVENUE-MODEL-VARIABLES.md` and §9 of `03-BUSINESS-PLAN-FIBE.md`. Discussion with Fibe opens cohort-tiered: passive placements 80/20 (Fibe/GC), hook-funded 70/30, AI-called 60/40, FD-holder 50/50, referral 90/10. Blended base case ~72/28. Net GC revenue = (Gross × GC share) − (Cards × cost per card). Cost per card = fixed ops + hook funding; variable by hook deployed.

Payback on Year 1 investment is computed in the `/revenue` calculator / `06-REVENUE-MODEL-VARIABLES.md`, not hardcoded here. Gate: GC unit-positive at the locked scenario. If the scenario locked for the pitch projects GC unit-negative, Phase 1 is a no-go.

## 3. Phased build — what we ship, when

```
Phase 0   Weeks −2 to 0    Contract + DPA signed, team assigned
Phase 1   Weeks 1–2        Anchor placement webview embedded (Media 1 slot)
                            KPI: 2% tap-through, 30% application rate, 50% approval rate
Phase 2   Weeks 3–10       + Home + Post-disbursal + Tailor-made carousel + notifications
                            KPI: 3% blended conversion; run-rate per locked scenario
Phase 3   Weeks 11–24      + Repayment + Email + Trending + Play&Win +
                            AI calling ramp + data opt-in negotiation
                            KPI: 5% conversion; run-rate per locked scenario
Phase 4   Weeks 25–52      + cohort expansion, Phase 3 data signals live
                            KPI: run-rate per locked scenario; GC unit-positive confirmed
```

Run-rate ₹ targets are set in `06-REVENUE-MODEL-VARIABLES.md` before Phase 0 closes. Not hardcoded here — they drift and undermine the gate criteria in §6.

## 4. Team

```
Role                              Allocation      Name / hire
──────────────────────────        ───────────     ───────────
Account lead                      100%            TBD — senior partnerships
Integration engineer              100% for 12w,   TBD — Node/Express fluent
                                  then 25%
Product analyst                   50%             existing
Content writer (Fibe-tonality)    25%             contractor, vetted
AI calling team                   15 dedicated    hire 5 by W4, 10 by W12, 15 by W24
                                                   agents
Ops / reporting                   10%             existing
```

## 5. Risk register

```
RISK                                IMPACT    LIKELIHOOD    MITIGATION
─────────────────────────────────   ──────    ──────────    ────────────────────────────
Fibe chooses to build in-house      H         L             Slide 17 of PM deck answers this
Axis co-brand conflict of interest  M         M             Axis surfaces first in reco
Conversion < 1.5% in Phase 1        H         M             Walk-away in Phase 1 contract
AI calling ramp too slow            M         M             Ramp gated to conversion proof
Data opt-in never materialises      M         H             Phase 1+2 don't depend on it
Fibe IPO quiet period               L         M             Contract before DRHP filing
Regulatory tightening (RBI)         M         M             Monthly compliance review
Commercial dispute                  L         L             Standard recon + escalation
Cannibalisation of existing         L         M             Cross-sell ranking tunable
 partnerships (BankKaro)
```

## 6. Decision criteria — go / no-go gates

```
Gate 1 — Sign contract
  Requires: commercials agreed per §9 of 03-BUSINESS-PLAN-FIBE.md (cohort-tiered,
            Fibe majority; GC floor = 20% passive, 30% hook-funded, 40% AI-called,
            50% FD-holder), DPA signed, anchor placement committed

Gate 2 — End of Phase 1 (Week 2)
  Go if: tap-through ≥ 1.5%, application rate ≥ 25%, approval rate ≥ 40%
  Hold if: 2 of 3 hit; iterate 2 more weeks
  Kill if: tap-through < 1%

Gate 3 — End of Phase 2 (Week 10)
  Go if: blended conversion ≥ 3%, month-on-month card volume growth ≥ 25%,
         GC unit-positive per /revenue calculator at current split,
         Fibe satisfied on cohort reporting
  Kill if: blended conversion < 1.5% OR GC unit-negative with no hook
           lever left to pull — negotiate down to lightweight version

Gate 4 — End of Phase 3 (Week 24)
  Go to Phase 4 if AI calling conversion lift is ≥ 1.5× cold AND
     GC still unit-positive
  Hold Phase 4 if lift < 1×
```

## 7. What we need from Great.Cards internal

```
1. Carve-out of 15 AI calling agents, Fibe-dedicated
2. API rate-limit bump: 5 RPS → 20 RPS on Fibe tenant
3. Content team sprint budget (₹15L) for Fibe-tonality library
4. Integration engineer availability (2 weeks full-time for webview + 10 weeks embed)
5. CFO sign-off on ~₹2.5 cr year-1 investment
6. Legal sign-off on standard DPA template with Fibe variations
7. Ops sign-off on daily reconciliation pipeline
```

## 8. What this account unlocks beyond itself

```
1. Template deal for next 5 lending fintechs
   Fibe is the reference; KreditBee / MoneyTap / Navi are next.

2. Credit-score-widget monetisation playbook
   If we crack "Decode your credit score" funnel on Fibe,
   we can sell that module to every lender with a score widget.

3. AI calling capability as productised service
   Dedicated Fibe team validates the service offer.
   Next lenders can license it directly.

4. Data opt-in pattern
   If Fibe's DPA works, it becomes our template for every lender.
   Phase 3 is the real long-term revenue driver.
```

## 9. 3-year view — benchmarked, not projected

```
                   Year 1        Year 2        Year 3
Cards / year       20K–60K       50K–1,20K     80K–2,00K
                   (pilot)       (full suite)  (data opt-in + AI)
```

Specific revenue and net-to-GC numbers: run `06-REVENUE-MODEL-VARIABLES.md` with the card-volume, commission, split, and hook-cost assumptions leadership signs off on. Do not pre-commit specific ₹ figures in this plan; they will go stale within a quarter.

Year 2 assumes data opt-in live and AI calling fully ramped.
Year 3 assumes Phase 4 complete + rev share negotiated.

## 10. What to say no to, even if Fibe asks

```
✗ Exclusivity — we need the same playbook for other lenders
✗ White-label deep customisation — static set of themes, not bespoke per-placement
✗ Custom card catalog per Fibe (no "Fibe-exclusive cards")
✗ Minimum guarantee — pure performance
✗ Sub-30% GC share
✗ Data residency outside Mumbai/Bangalore tier-1 (RBI/AWS constraint)
✗ Taking credit risk on card rejections (we're a marketplace; bank holds risk)
```

## 11. Next actions — this week

```
☐ Abhyudaya: get sign-off on this plan from GC leadership (by W0+3)
☐ Abhyudaya: finalise pitch deck CXO + PM versions with sales head (W0+5)
☐ Partnerships head: book meeting with Fibe CPO (W0+7)
☐ CFO: approve ₹2.5 cr year-1 budget (W0+10)
☐ Ops: carve out 5-agent AI calling pod — staged hiring plan (W0+14)
```
