# Pitch Deck — PM Version

**Audience:** Fibe Product Manager, integration lead, engineering manager, growth lead
**Length:** 19 slides
**Duration in meeting:** 30–40 minutes
**Purpose:** tactical walkthrough. How it plugs in, what changes in Fibe's stack, what the SLAs are.
**Tone:** precise, show-not-tell, no strategic hand-waving.

---

## Slide-by-slide

### 01 · Cover

```
Fibe × Great.Cards
Integration walkthrough — PM brief.

Live demo · API contracts · SLA · lifecycle ·
cohort strategy · commercials · launch plan.
```

---

### 02 · What the live demo does, in one minute

Screenshot grid of the 8 working phone mocks.

```
This deck has a live, working companion at /localhost:3000.
Every card you see is fetched in real time from the Great.Cards Partner API.
Zero mock data. Zero fake screenshots.

The 8 placements shown:
  1. Home widget
  2. Loan declined
  3. Post-disbursal thank-you
  4. Repayment / EMI tracker
  5. Sanctioned email
  6. Trending row tile                        (new — replaces banner)
  7. Tailor-made offers carousel              (new — replaces Media 6 IDFC-only slot)
  8. Play & Win — LTF card unlock             (new — Media 3 reward surface)
```

---

### 03 · API surface — the whole thing fits on one slide

```
Deployment model: WEBVIEW, GC-hosted. Fibe embeds a signed URL.
No Fibe-side API proxy. No Fibe-side token handling. No Fibe-side card rendering.

Fibe → GC handshake (native app side, <200 LOC):
  1. Fibe generates a signed URL per session:
        https://fibe.greatcards.in/<placement>?t=<jwt>
     where jwt payload = { fibe_user_hash, cohort_tag, score_bucket,
                           income_rounded, pincode, placement_id, exp }
  2. Fibe embeds that URL in a WebView (Android CustomTabs / iOS SFSafariViewController).
  3. Fibe listens for postMessage events: card_tapped, application_started,
     application_submitted, bank_redirect.

Inside the webview (all GC-side, Fibe never sees these):
  POST  /partner/token                      → 23h JWT (service-to-service)
  GET   /partner/cardgenius/init-bundle     → categories, banks, metadata
  POST  /partner/cardgenius/cards           → filtered list
  POST  /partner/cardgenius/calculate       → spend-based savings reco
  POST  /partner/cardgenius/eligiblity      → eligibility check
  GET   /partner/cardgenius/cards/:alias    → card detail
```

Subtext: "Fibe ships one webview embedding. Everything else — token refresh, caching, card rendering, deep-links, attribution — is GC's problem."

---

### 04 · Data we receive — zero PII

```
   We receive                        We do not receive
   ───────────                        ─────────────────
   Bucketed credit score              Exact credit score
     (600 / 650 / 750 / 800)          PAN number
   Rounded monthly income             Name
     (nearest 10k)                    Phone / email
   Employment type                    Address (beyond pincode)
     (salaried / self-employed)       Bureau report
   Pincode (resolved to city)         Transaction data
   Loan purpose (for 1 screen)        Device fingerprint
   Category spend (for calculate)
```

Subtext: "Zero PII is not a nice-to-have. It is the architecture. Phase 3 data sharing requires explicit Fibe-side user opt-in and a separate DPA."

---

### 05 · Placement #1 — Home widget

```
Where:   Homepage · "Hand-picked for you" row (Media 5)
Trigger: App open, user logged in, no credit event in last 24h
API:     POST /calculate (with default spend buckets)
         OR POST /cards (free_cards:true if no spend data)
Returns: 3 cards, sorted by annual_savings
UI:      Existing Fibe card-tile component, populated with GC data
         GC attribution badge ("Powered by Great.Cards" — 10px, gray)

Fallback: On API error, hide the row entirely. Never show a broken state.
SLA:     P95 < 2s (prod), P99 < 4s
Cold:    First-load caching via init-bundle (already cached server-side)
```

Screenshot of the current Fibe home, with overlay arrow on the slot.

---

### 06 · Placement #2 — Loan declined

```
Where:   Rejection screen · below "Loan not approved" header
Trigger: Loan application rejected (any reason)
API:     POST /cards with body:
         { free_cards: true, credit_score: 600, sort_by: "annual_savings" }
         + cohort filter: self-employed / FD-holder / low-score
Returns: 1 card — context-appropriate (see §06 of prototype spec)
UI:      Empathetic copy. No "you failed." Frame as "here's how to be approved next time."

Cohort routing (PM-critical):
  if (user.is_fibe_fd_holder)     → FD-backed card recommendation
  else if (rejection_reason == 'self-employed')
                                   → self-employed-friendly card
  else if (credit_score < 650)    → credit-builder narrative (no card sell)
  else                             → suppress (show nothing — do not force a sell)
```

---

### 07 · Placement #3 — Post-disbursal thank-you

```
Where:   Thank-you screen after loan disbursement
Trigger: Disbursement event (highest-intent moment in entire funnel)
API:     POST /calculate → POST /eligibility
Returns: 2 cards, eligibility-verified
UI:      Celebratory. "Congrats on your loan — here's how to make your spending pay you back."

Why this placement matters:
  Conversion benchmark: 5–8% on disbursed users (internal data from other lenders)
  That's 3× the cold benchmark.
```

---

### 08 · Placement #4 — Repayment / EMI tracker

```
Where:   Loans tab · EMI tracker screen
Trigger: User checks EMI due date or pays EMI
API:     POST /cards with free_cards:true, sort_by:annual_savings
Returns: 2 cards
Copy:    "Save on your monthly spend — enough to cover next month's EMI."
```

---

### 09 · Placement #5 — Sanctioned email

```
Where:   Email channel · loan sanction confirmation
Trigger: Sanction email send
API:     POST /calculate (Travel default)
Returns: 2 cards
UI:      Inline in email body. Tappable. Deep-links back to app.
```

---

### 09a · Placements #6–#8 — the three new ones

```
#6 Trending row tile                         (new — replaces generic banner)
   Where:   Homepage · Trending row
   Trigger: Every home load
   API:     POST /cards { free_cards: true, sort_by: 'popularity' }
   Returns: 1 featured LTF tile (rotates daily)
   Why:     Fibe's Trending row is currently a promo slot. We turn it into
            a zero-objection LTF card entry point.

#7 Tailor-made offers carousel               (new — replaces Media 6 IDFC-only slot)
   Where:   Credit Score page · "Credit cards that meet all your needs"
   Trigger: Credit score page view
   API:     POST /cards { credit_score: <bucket>, sort_by: 'annual_savings' }
   Returns: 3-card horizontal carousel, eligibility-pre-filtered
   Why:     Today this surface shows only IDFC First. We replace the
            1-bank feed with a 100+ card eligibility-filtered carousel.
            This is the double-monopoly wedge.

#8 Play & Win — LTF card unlock              (new — Media 3 reward surface)
   Where:   Rewards tab · Play & Win game completion screen
   Trigger: Game win event
   API:     POST /cards { is_ltf_only: true }
   Returns: 3 LTF cards as "reward unlock" UI
   Why:     Users are in reward mindset, not sales mindset. Gamified
            conversion benchmarks at 3–8× cold.
```

---

### 10 · Notification engine — the matrix

Full matrix from `01-PROTOTYPE.md` §5.1. This slide is dense on purpose; leave-behind material.

Key callouts (annotated on the slide):

```
• In-Journey = 0 touches. Non-negotiable.
• Rejected (non-FD) cap = 3/mo, credit-builder only.
• Cadence days are suggestions; Fibe's send-time optimization overrides if conflicting.
```

---

### 11 · Cohort segmentation logic — pseudocode

```python
def assign_cohort(user):
    if user.has_pending_loan_application:
        return 'IN_JOURNEY'               # 0 notifications

    if not user.pan_verified:
        return 'REG_NO_PAN'

    if not user.has_taken_loan:
        return 'REG_PAN_NO_LOAN'

    if user.latest_loan_status == 'APPROVED':
        if user.days_since_disbursement <= 7:
            return 'APPROVED_ACTIVE'
        else:
            return 'APPROVED_TENURED'

    if user.latest_loan_status == 'REJECTED':
        if user.is_fibe_fd_holder:
            return 'REJECTED_FD_HOLDER'
        if user.rejection_reason == 'self_employed':
            return 'REJECTED_SELF_EMPLOYED'
        if user.rejection_reason == 'low_credit_score':
            return 'REJECTED_CREDIT_BUILDER'
        return 'REJECTED_SUPPRESS'        # monetisation not viable
```

Fibe owns the assignment (we only need the tag).

---

### 12 · AI calling integration

```
Handoff format: daily CSV / webhook to GC ops endpoint
  Fields: cohort_tag, bucketed_score, pincode, cohort_event_timestamp, fibe_lead_id
  (no PII; lead_id is Fibe's internal hash)

Call flow:
  1. Fibe sends lead → GC dialer queue within 1h
  2. Call attempt within 24h (SLA)
  3. Max 3 attempts over 7 days
  4. Disposition fed back to Fibe daily
  5. Converted leads → Fibe's credit-card-applied event → Fibe credits user's engagement score

Branding:
  "Calling from Fibe's cards team" (default)
  "Calling from Great.Cards on behalf of Fibe" (legal-preferred)
```

---

### 13 · Revenue attribution — how commissions flow

```
User flow:
  Fibe app → GC recommendation → user taps → bank application → bank approval → card issued

Commission trigger:
  Bank confirms card issuance (T+7 to T+30 typical)

Flow of funds:
  Bank → Great.Cards : full commission (~₹2,000)
  Great.Cards → Fibe : cohort-tiered rev share (§9 of Fibe business plan)
                        Passive placements → 80% Fibe / 20% GC
                        Hook-funded         → 70% Fibe / 30% GC
                        AI-called leads     → 60% Fibe / 40% GC
                        Paid monthly on reconciliation

Tracking:
  Every recommendation carries fibe_user_hash + placement_id + session_id
  Dashboard shared with Fibe: daily clicks, applications, approvals, revenue
  Monthly reconciliation report, bank-wise
```

---

### 14 · Integration timeline

```
Week 0    Kick-off, DPA signed, signed-URL contract agreed (JWT payload schema)
Week 1    Fibe-side: embed webview at anchor placement (Media 1 slot)
          + wire postMessage listeners (card_tapped, application_submitted)
          ~150–200 LOC Android + iOS combined. No backend work.
          GC-side: placement UI live on sandbox, attribution wired.
Week 2    Live at 5% traffic. Ramp to 100% if P95 latency + error rate clean.
Week 4    Phase-1 conversion read-out.

Phase 2 kicks off Week 5 if green-light. (Non-anchor placements reuse
the same webview shell — no additional Fibe-side engineering needed.)
```

Subtext: "Because the integration is a webview, Fibe-side effort is capped at one placement-embedding sprint. Every subsequent placement is a URL change."

---

### 15 · SLAs & ops

```
API uptime                 99.9% monthly (measured at GC edge)
API latency                P95 < 2s, P99 < 4s (prod; UAT is slower)
Incident response          T+15m ack, T+1h mitigation, T+24h RCA
Content refresh            Card catalog updated weekly, deep-link checked nightly
Compliance                 Monthly RBI digital-lending-disclosure audit trail shared
Reporting cadence          Daily dashboard, weekly Slack, monthly written review
Support channel            Dedicated Fibe Slack + email; GC integration engineer on-call
```

---

### 16 · Risk register (PM perspective)

```
RISK                                   MITIGATION
────────────────────────────────────   ─────────────────────────────────────
API latency in prod > 2s               Server-side response cache, 5-min TTL
Card catalog stale / deep-link broken  Nightly healthcheck, auto-hide broken tiles
Bank rejection rate > 25% post-reco    Tighten eligibility engine pre-filter
Notification fatigue → unsubscribes    Hard cohort caps (§10 matrix), A/B on cadence
Commercial dispute                     Monthly reconciliation, signed commercials
Regulatory — RBI digital lending norms Quarterly compliance review, DPA enforced
Cannibalisation of Axis co-brand       Axis co-brand surfaces first in reco engine
                                         (opt-in via GC ranking weight — Fibe controls)
Data opt-in (Phase 3) fails            Phase 1+2 work without it; opt-in is upside
```

---

### 17 · Build vs buy (if Fibe considered it)

```
Build in-house                            Use Great.Cards
────────────────                          ────────────────
6–9 mo eng time (4 devs)                  2 weeks webview embed (~200 LOC)
Sign 10+ bank partnerships                Already signed
Legal + compliance team                   Already done
Eligibility engine from scratch           Live, battle-tested
Card catalog + creative + updates         Maintained by us, weekly
₹3–5 cr build cost year 1                 ₹0 build cost
Opportunity cost on loan product roadmap  Zero
```

One line closing: "The question isn't whether to offer cards. It's whether to build that layer in-house. We've done the math."

---

### 18 · What we need from the PM — concrete

```
Week 0 from you:
  ☐ One Android + one iOS engineer for 1 week (webview embed)
  ☐ Signed-URL JWT signing key provisioned on your backend
  ☐ Lifecycle event webhook feed to GC (approved / rejected / disbursed / repaid)
  ☐ Content review for Fibe-tonality approval
  ☐ Legal on DPA — standard Fibe template works

Week 0 from us:
  ☐ Webview endpoints live on sandbox + prod (all 8 placements)
  ☐ postMessage event contract documented
  ☐ Integration engineer on-call for 2 weeks
  ☐ Content library (all 8 placements + notification copy)
  ☐ Dashboards + alerts provisioned

Commit to a 2-week Phase 1 webview pilot and we're live.
```

---

## Live demo — timing inside the 40-min meeting

```
00:00 – 03:00   Slide 01–02 (context)
03:00 – 06:00   Slide 03–04 (API + PII)
06:00 – 11:00   Live demo — localhost:3000, walk the 5 screens
11:00 – 18:00   Slides 05–09 (placement deep-dive)
18:00 – 23:00   Slides 10–11 (lifecycle engine)
23:00 – 27:00   Slides 12–13 (AI calling + attribution)
27:00 – 32:00   Slides 14–17 (timeline, SLAs, risk)
32:00 – 35:00   Slide 18 (ask)
35:00 – 40:00   Q&A
```

## What success looks like

PM leaves with:
1. A 2-week webview integration estimate they can defend upward (capped at one sprint)
2. A cohort segmentation pseudocode they can hand to an engineer
3. The risk register, which they respect because it's honest
4. A Slack channel provisioned with a GC integration engineer by end of next day

If they ping the Slack channel within 48h asking for the signed-URL JWT schema — we won.
