# Business Plan — External (Fibe-facing)

**Audience:** Fibe commercial lead, legal, CFO, CPO
**Purpose:** Leave-behind document after the stakeholder meeting. Formal articulation of terms, obligations, and commercial structure.
**Version:** Draft 1.0 — terms negotiable.
**Tone:** formal, contract-adjacent, no marketing language.

---

## 1. The partnership, in one paragraph

Great.Cards will integrate its credit card recommendation and fulfillment stack into Fibe's app across 8 defined placements and 9 lifecycle-triggered notification cohorts. Integration is deployed as a GC-hosted webview embedded via signed URL — Fibe native engineering is capped at one placement-embedding sprint. Fibe will earn a revenue share on every card issued through the integration. Great.Cards will operate all downstream infrastructure — bank relationships, eligibility engine, AI calling for lead conversion, compliance, and reporting. The integration is zero-PII by design. There is no minimum guarantee and no exclusivity in either direction.

## 2. Scope of work

### 2.1 Great.Cards obligations

```
A. Technical
   • Host and operate the Fibe webview at fibe.greatcards.in, with
     per-placement routes for all 8 placements
   • Maintain and operate 5 Partner API endpoints (token, cards, calculate,
     eligibility, card-detail) at 99.9% monthly uptime
   • Host and maintain card catalog of 100+ active credit card products
   • Provide eligibility filtering per user session (bank rule pre-filter)
   • Provide spend-based recommendation engine
   • Zero-PII integration — bucketed credit score, rounded income, pincode only,
     passed via signed JWT in URL

B. Content & creative
   • Supply content library for all 8 placements in Fibe tonality
     (Fibe teal, Plus Jakarta Sans, Fibe voice — reviewed and approved by Fibe)
   • Supply lifecycle notification copy for all 9 cohorts × 5 cadence days
     (full library in 05-NOTIFICATIONS-COPY.md)
   • Monthly content refresh, weekly deep-link healthcheck

C. Operations
   • Dedicated AI calling team (15 agents ramped over 26 weeks)
     calling Fibe-shared leads under Fibe-branded or GC-branded script
   • 24-hour SLA on first call attempt, 3 attempts over 7 days
   • Daily lead disposition feedback to Fibe
   • Weekly conversion and revenue dashboards
   • Monthly written review

D. Compliance
   • RBI Digital Lending Directions 2025 compliance on all card flows
   • Monthly disclosure audit trail shared with Fibe
   • Quarterly joint compliance review
```

### 2.2 Fibe obligations

```
A. Technical
   • Embed the GC webview at anchor placement (Android + iOS, ~200 LOC combined)
   • Generate and sign per-session JWT per webview open (payload: fibe_user_hash,
     cohort_tag, score_bucket, income_rounded, pincode, placement_id, exp)
   • Wire postMessage listeners (card_tapped, application_submitted, bank_redirect)
   • Fire lifecycle events to GC webhook (approved / rejected / disbursed /
     repaid / registered)
   • Expose Fibe-side cohort tags on lead handoff

B. Placements (phased per §3 below; all 8 share one webview shell — adding a
   placement after Phase 1 is a URL change, not an engineering sprint)
   • Phase 1: anchor placement (Media 1 — Credit Score "Credit cards that meet
     all your needs" tile)
   • Phase 2: Home widget, Post-disbursal thank-you, Tailor-made carousel
     (Media 6 replacement)
   • Phase 3: Repayment tracker, Sanctioned email, Trending row tile,
     Play & Win LTF unlock
   • Phase 4: cohort expansion + data opt-in

C. Notification channels
   • Push, email, WhatsApp — Fibe's existing channels, GC provides content
   • Respect cohort caps (§6.2 of prototype spec)
   • In-Journey cohort receives zero GC content — non-negotiable

D. Lead sharing for AI calling
   • Daily handoff of approved + rejected + post-disbursal cohorts
     in agreed format (hashed IDs, cohort tags, no PII)
   • Ingestion of GC call dispositions into Fibe CRM

E. Commercial
   • Monthly reconciliation and payment within T+30 of invoice
```

## 3. Phased integration plan

```
Phase 1   Weeks 1–2      Anchor placement webview embedded, live at 5% → 100% traffic
Phase 2   Weeks 3–10     +3 placements (Home, Post-disbursal, Tailor-made carousel),
                          notification engine live
Phase 3   Weeks 11–24    +3 placements (Repayment, Sanctioned email, Trending,
                          Play & Win), AI calling ramp, data opt-in DPA signed
Phase 4   Weeks 25–52    Cohort expansion, Phase 3 data signals deployed
```

Each phase has kill criteria. Either party may walk without penalty at phase transitions if criteria are not met.

## 4. Commercial terms

### 4.1 Revenue share — proposed scenarios

Fibe's user base and placement contribution justify Fibe taking the majority share. Three scenarios on the table, all at **₹2,000/card gross commission from bank to GC**:

```
Scenario         Fibe %    GC %    Fibe / card    GC / card
────────────    ──────    ────    ───────────    ──────────
A  Conservative  70%       30%     ₹1,400         ₹600
B  Balanced      80%       20%     ₹1,600         ₹400
C  Aggressive    90%       10%     ₹1,800         ₹200
```

**GC must remain unit positive in every scenario.** Per-card cost envelope (excluding hook funding, excluding commissions):

```
Direct cost per card:     ~₹150 (API infra, reporting, support allocation)
Hook funding per card:    ₹0–₹1,050 depending on hook deployed (see 04-MARKETING-HOOKS.md)
```

**Unit-positive line:** every hook GC chooses to deploy must leave more than ₹150 after hook funding + Fibe share. This eliminates H1 (EMI-on-us, costs ₹1,050) from deployment in Scenario C; limits it in Scenario B.

### 4.2 Volumes and revenue — dynamic, not static

**All volume and revenue numbers in this plan are variable.** There is no fixed projection in the pitch pack. Inputs, formulas, and sensitivity are maintained in `06-REVENUE-MODEL-VARIABLES.md`.

For peer discussion and meeting-time scenario locking:

```
1. Open 06-REVENUE-MODEL-VARIABLES.md
2. Edit the INPUT table (cohort reach, conversion rate, commission,
   split, hook cost) with your own assumptions.
3. Apply the FORMULAS block.
4. Validate against the BENCHMARK ranges (Paisabazaar, BankBazaar,
   aggregator market totals).
5. Lock one scenario as "pitch default" before the meeting.
6. Keep the calculator live during the meeting — change assumptions
   on screen if Fibe pushes back.
```

Benchmark range to challenge any input against:

```
Year 1 realistic  : 20,000 – 60,000 cards
Year 2 realistic  : 50,000 – 1,20,000 cards
Year 3 realistic  : 80,000 – 2,00,000 cards

Any input projecting above these requires an explicit reason.
```

### 4.3 Cohort-specific split tiers (GC proposal)

Different cohorts have different GC contribution levels. We propose split tiers:

```
Cohort                                        Fibe %    GC %    Rationale
───────────────────────────────────────────   ──────    ────    ─────────────────────────
Passive placements (Home, Trending, Credit    80%       20%     Fibe surface + user
  Score inline, Secured Cards replacement)                       = primary contribution
Hook-funded placements (EMI-on-us, Play&Win)  70%       30%     GC funds the hook
  where cost/card > ₹400
AI-called lead conversions                    60%       40%     GC ops cost significant
Credit-score-builder cohort (no card sell)    0 / 100    0      Education flow; all
                                                                downstream loan value
                                                                accrues to Fibe
Rejected FD-holder unlock                     50%       50%     Shared user + product
                                                                insight
Referral (Hook #8) — user-to-user             90%       10%     Essentially organic
```

**Blended effective share** at base-case volumes: Fibe ~72% / GC ~28%.
At stretch volumes with premium-card mix: Fibe ~70% / GC ~30%.

### 4.4 Commission structure — bank-by-bank

```
Bank                Typical commission range    Paid by
───────────────    ─────────────────────────   ──────────────────
HDFC                ₹1,800 – ₹3,500             Bank to GC, GC to Fibe
ICICI               ₹1,500 – ₹3,000             Bank to GC, GC to Fibe
Axis                ₹1,500 – ₹2,500             Bank to GC, GC to Fibe
IDFC First          ₹1,200 – ₹2,500             Bank to GC, GC to Fibe
SBI Card            ₹1,000 – ₹2,000             Bank to GC, GC to Fibe
Standard Chartered  ₹2,000 – ₹4,000             Bank to GC, GC to Fibe
[~10 more banks]    variable                    Bank to GC, GC to Fibe

Ballpark blended:   ₹2,000 / card (used in model)
Premium-mix blend:  ₹2,800 / card (feasible at stretch volumes)
```

### 4.5 Attribution rules

```
Commission attributes to Fibe placement if:
  • User applied within 30 days of GC recommendation click
  • Application carries placement_id + fibe_user_hash
  • Bank confirms card issuance (not application approval alone)

Disputes resolved via monthly reconciliation; bank-issued statement is
source of truth.
```

## 5. Data & privacy

### 5.1 What GC receives per session

```
• Bucketed credit score         (600 / 650 / 750 / 800)
• Rounded monthly income        (nearest ₹10,000)
• Employment type               (salaried / self-employed)
• Pincode                       (6-digit)
• Cohort tag                    (REG_NO_PAN, REG_PAN, APPROVED_ACTIVE, etc.)
• Session & placement IDs
• Anonymised Fibe user hash     (SHA-256 of internal Fibe user ID)
```

### 5.2 What GC never receives (Phase 1–2)

```
• PAN, Aadhaar, any government ID
• Name, phone, email, address
• Exact credit score
• Bureau report or CIR data
• Transaction data
• Device fingerprint
• Bank account details
```

### 5.3 Phase 3 data opt-in (separate DPA)

```
If Fibe and GC mutually agree to Phase 3 data sharing:
  • Requires separate DPA signed by both Legal teams
  • Requires explicit in-app user opt-in (not bundled in T&C)
  • Scope limited to: repayment behaviour buckets, spend category buckets,
    engagement tier — all bucketed, never raw
  • User can revoke opt-in via Fibe app; GC must delete within 30 days
  • Data residency: Mumbai or Bangalore AWS region
```

### 5.4 Data retention

```
Session-level recommendation data   Retained 90 days then aggregated
Conversion events                    Retained 7 years (regulatory)
User hash mapping                    Retained for partnership duration + 2 years
All retention periods stated in DPA, aligned with DPDP Act 2023
```

## 6. SLAs

```
Service                   SLA                    Measurement
──────────────────────    ───────────────────    ──────────────────────────────
API uptime                99.9% monthly          GC edge, rolling 30-day
API latency (P95)         < 2s                   GC edge, prod tenant
API latency (P99)         < 4s                   GC edge, prod tenant
AI call first attempt     < 24h from handoff     Internal CRM, audited
AI call 3rd attempt       < 7 days               Internal CRM, audited
Incident ack              T+15m                  Pagerduty, shared
Incident mitigation       T+1h                   Pagerduty, shared
Incident RCA              T+24h                  Written, shared on Slack
Content refresh           Weekly                  Git log, shared
Dashboard refresh         Daily                   Dashboard audit log
```

Breach consequences: SLA credits against monthly commission payable to GC.

## 7. Termination

```
Either party may terminate:
  • At any phase transition if kill criteria not met — no penalty
  • For cause (material breach) — 30-day cure period, then termination
  • For convenience — 90-day notice in year 1, 60-day notice year 2+
  • Immediate on regulatory order, insolvency, or reputational event

On termination:
  • GC ceases to receive new lead handoffs
  • Fibe removes GC placements and content within 30 days
  • Outstanding commissions payable within T+60
  • Data deletion per DPA (30 days for user-level, retention per §5.4 for
    regulatory-required events)
  • No exit fee in either direction
```

## 8. Non-exclusivity

```
Fibe may partner with other card recommendation providers at any time.
Great.Cards may partner with other lending fintechs at any time.
Neither party may use the other's confidential business data in a
partnership with a direct competitor without written consent.
```

## 9. Cohort-specific commercial terms

This section is the normative source for all rev-share splits. §4.3 describes the same structure at placement-type granularity; both must stay in sync. Fibe takes majority share in every cohort except AI-called leads (where GC incurs material call-ops cost).

```
Passive placements (Home, Trending, Credit Score inline, Tailor-made carousel,
  Play & Win, Secured-card replacement)
  Rev share:  80% Fibe / 20% GC
  Rationale:  Fibe surface + Fibe user = primary contribution

Hook-funded placements (EMI-on-us, Combo) where GC cost/card > ₹400
  Rev share:  70% Fibe / 30% GC
  Rationale:  GC funds the hook out of its share

Rejected cohort — FD-backed cards to Fibe FD holders
  Rev share:  50% Fibe / 50% GC
  Rationale:  Fibe has already acquired and qualified the user; joint insight

Rejected cohort — Credit-builder narrative (salvageable)
  No commission flow — education and ladder-back-to-Fibe-loan
  Fibe captures all re-application value; GC captures brand goodwill

AI-called converted leads
  Rev share:  60% Fibe / 40% GC
  Rationale:  GC incurs direct call-ops cost

Referral-sourced applications
  Rev share:  90% Fibe / 10% GC
  Rationale:  Essentially organic; low GC contribution
```

**Blended effective share** at base-case volumes: Fibe ~72% / GC ~28%.

## 10. Governance

```
Weekly      Integration engineering sync (both teams)
Bi-weekly   Product sync — placements, content, cohort performance
Monthly     Commercial review — conversion, revenue, disputes
Quarterly   Strategic review — Fibe CPO + GC leadership
Ad-hoc      Incident reviews, SLA breaches, regulatory changes
```

A shared Slack channel is provisioned on contract signing.

## 11. Open items for negotiation

```
☐ Rev share: 70%, 80%, or 90% Fibe for passive placements (default: 80%)
☐ Payment terms: T+30 vs T+45
☐ Axis co-brand positioning — surface first in reco, or neutral ranking
☐ Exclusivity on FD-backed card cohort (GC asks for none; Fibe may ask)
☐ Minimum placement commitment in year 1 (GC asks for 3; Fibe may commit 1)
☐ AI calling branding — Fibe-branded vs GC-branded vs joint
☐ Phase 3 data opt-in timing (start week 12 or week 26)
☐ Termination notice period in year 1 (30 / 60 / 90 days)
```

## 12. Signatories

```
For Fibe (Social Worth Technologies Pvt Ltd):
  Name, Title, Date

For Great.Cards:
  Name, Title, Date

Annexures:
  A. Technical integration spec (same as PM deck §03)
  B. Data processing agreement (separate doc)
  C. Service level schedule (§6 expanded)
  D. Cohort segmentation logic (same as PM deck §11)
  E. Reporting templates
```

---

**This document is a draft for discussion, not a binding term sheet. Binding terms follow contract execution.**
