# Pitch Deck — CXO Version

**Audience:** Akshay Mehrotra, Ashish Goyal, Fibe CXO, Fibe board observers
**Length:** 11 slides
**Duration in meeting:** 12–15 minutes
**Purpose:** strategic buy-in. Not a technical deck. Every slide answers the question "so what, for Fibe?"
**Tone:** confident, numbers-first, no jargon, one argument per slide.

---

## Slide-by-slide

### 01 · Cover

```
Fibe × Great.Cards
A new revenue line that doesn't touch your loan book.

100+ cards. 8 in-app placements. Zero PII.
Revenue model — live, tunable on screen.

— Great.Cards · April 2026
```

Note: the specific revenue headline for Slide 01 is chosen at pitch-time from `06-REVENUE-MODEL-VARIABLES.md` (peer-locked scenario). Do not pre-commit a number in the deck template.

Visual: Fibe teal split with GC orange accent. No stock imagery.

---

### 02 · The one-slide thesis

```
9 lakh active borrowers.
350,000 disbursals / month.
80% CIBIL 700+.

One co-branded card.

Every user who wants anything else —
travel card, fuel card, premium card, credit-builder card —
leaves Fibe.

We fix that, with 100+ cards, an eligibility engine,
our own calling team, and zero PII crossing the wire.
```

No bullets. Six line-break paragraphs, editorial typography.

---

### 03 · The revenue — live calculator

```
This slide is not a projection. It is a calculator.

Inputs we edit on screen with Fibe:
  • Cohort reach per month
  • Conversion rate by cohort
  • Commission per card (blended)
  • Revenue share direction
  • Hook funding per card

Outputs we compute live:
  • Cards / year
  • Gross revenue
  • Fibe share
  • GC net after cost

Benchmark range to anchor against:
  Paisabazaar peak  ~80–100K cards / year
  Year 1 realistic  20K–60K cards
  Year 2 realistic  50K–1,20K cards

For zero tech cost, zero credit risk, zero PII exposure.
```

Bottom row tiny: "Model file: 06-REVENUE-MODEL-VARIABLES.md. Lock a scenario before the meeting."

---

### 04 · Where this lives in your app

7-up grid of Fibe screenshots (Media 1–7, real photos). One-line caption each.

```
Media 5 · Home "Hand-picked for you"   → 1 rotating card tile
Media 4 · Fibe HUB All products        → new "Credit Cards" product
Media 1 · Credit Score · Tailor offers → anchor slot (already exists!)
Media 2 · CIR 809                      → post-score reco strip
Media 3 · Rewards                      → FibeCoin-gated offers (Play & Win LTF)
Media 6 · Credit Score · Tailor offers → IDFC-only today; we replace with 100+ cards
Media 7 · Secured Credit Cards         → IDFC-only today (FIRST EARN / WOW / BLACK)
+ Sanctioned email + Rejection page + Post-disbursal thank-you
```

Callout: "Fibe shows exactly **two** card surfaces today — Media 6 and Media 7 — and **both** are IDFC First only. One bank. Two slots. 9L users. That is the wedge."

---

### 05 · Why Us — the moat, ranked

```
1. 100+ card catalog, live today        (your Axis co-brand is 1 product)
2. Eligibility engine                    (no user-facing rejections)
3. Spend-based recommendation            (not a banner rotation)
4. Our own AI calling team               (Fibe shares leads, we convert)
5. Compliance + bank relationships       (already signed)
6. Zero-PII integration                  (bucketed, rounded, hashed)
```

Each row has a one-word differentiator vs. "build it in-house": Time · Risk · Talent · Ops · Legal · Compliance.

---

### 06 · The rejection question — answered honestly

```
Fibe rejects on pincode, salary, PAN, employment —
not on bad credit behaviour.

That means banks will reject these users too.
We will not pretend otherwise.

What we can monetise of your rejects:

  → Self-employed rejects        → self-employed-friendly cards
  → Existing Fibe FD holders      → FD-backed cards (pre-qualified)
  → Low-credit-score rejects      → credit-score-builder narrative
                                     (ladder back to a Fibe loan, not away)

What we will not do:
  Secured cards to cash-strapped users. Ever.
```

Bottom: "This honesty is the differentiator. Any partner promising to monetise 100% of your rejects is wrong."

---

### 07 · The superpower — if Fibe's distribution were under us

```
Three opt-in signals →  three step-changes

1. Credit behaviour (repayment, bounce, utilisation)
   → pre-approved CC lists, refreshed daily
   → user never sees a recommendation they'd be rejected on

2. Transaction patterns (category spend)
   → per-user card match, not per-segment
   → conversion 3–5× vs generic reco

3. App behaviour (engagement, loan intent, FD activity)
   → send-time + channel optimisation
   → 8–12% conversion on called leads vs 3–5% cold
```

Closing line: "We are not asking for PII. We are asking for three bucketed signals, opt-in."

---

### 08 · Lifecycle notification strategy

One slide, one matrix.

```
                             D1    D3    D7    D14   D30   Cap/mo
Registered, no PAN           •     —     •     —     •      3
Registered + PAN             •     •     —     •     •      5
In-Journey                  [silent — 0 touches, non-negotiable]
Approved (with loan)         •     •     •     •     •      4
Approved (no loan)           •     —     •     —     •      3
Rejected (FD holder)         •     —     •     —     —      2
Rejected (salvageable)       •     —     •     —     •      3   (no card sell — credit builder only)
Rejected (unsalvageable)     •     —     —     —     —      1   (one empathetic email, then silent)
Credit-widget users          •     —     —     •     •      3
```

Subtext: "DND on In-Journey is non-negotiable. We never blast your high-intent applicants."

---

### 09 · The ladder — Phase 1 → 2 → 3

```
Phase 1   Month 1–3     Anchor placement only (Media 1 slot)
                        Goal: 2% conversion. Revenue = live calculator output.

Phase 2   Month 4–6     + Home + Post-disbursal + notifications live
                        Goal: 3% conversion. Revenue = live calculator output.

Phase 3   Month 7–12    + AI calling + data opt-in
                        Goal: 5% conversion. Revenue = live calculator output.
```

Revenue for each phase is computed in the `/revenue` calculator with cohort reach, conversion, commission and split inputs locked jointly before the meeting. No static figures committed here.

Visual: a 3-step teal ladder. Each step has its own kill-criteria line.

```
If Phase 1 conversion < 1.5%, we walk. No lock-in.
If Phase 2 can't beat phase 1 by 30%, we renegotiate.
Phase 3 is by mutual choice, with data sharing agreement.
```

---

### 10 · The ask

```
From Fibe:
1. One anchor placement, 60-day pilot
2. Notification-lifecycle integration (content from us, pipes from you)
3. Commercial terms — Fibe majority share, cohort-tiered (70/30 passive → 60/40 AI-called), negotiable

From us:
1. Webview integration in 2 weeks (everything under GC control)
2. Content + creative for all 8 placements
3. AI calling team dedicated to Fibe funnel, on 24h SLA
4. Weekly conversion + revenue read-outs

Decision we're asking for today:
   Green-light Phase 1 pilot.
```

---

### 11 · Close

```
Your loan book: untouched.
Your risk: unchanged.
Your brand: enhanced.
Your revenue: a new line — sized live on the calculator
              with your team's own numbers.

Phase 1 pilot. 60 days. No lock-in.

Webview integration. 2 weeks to live.
```

Single CTA button: "Book the working session →"

---

## Speaker notes — cheat sheet

```
Slide 02 → pause after "every user who wants anything else leaves Fibe." Let it land.
Slide 03 → cohort-tiered rev share — open at 70/30 Fibe:GC (passive placements), floor at 60/40 (hook-funded / AI-called). Fibe always takes majority.
Slide 06 → this is where you win trust. Do not oversell rejects.
Slide 07 → "data opt-in, not PII" — repeat this line twice.
Slide 09 → emphasize kill criteria. CXOs love walk-away clauses.
Slide 10 → the decision we're asking for today. One sentence. Then silence.
```

## Appendix (handout, not presented)

- Revenue model workbook (same as §10 of prototype)
- Technical integration doc (same as §11 of prototype)
- Rejection cohort breakdown with unit economics
- Bank relationships list
- AI calling team org + SLA doc

## What success looks like

CXO leaves the meeting able to repeat three things in one sentence each:
1. "A new revenue line — sized live on their calculator with my team's own numbers. No risk, no PII."
2. "They're honest about rejects — credit-builder, not secured cards to the broke."
3. "2-week webview integration, 60-day pilot, walk-away clause."

If they can repeat those three, we win the pilot.
