# Web Prototype Spec — Fibe × Great.Cards

**Version:** 2.0 — complete rewrite  
**Owner:** Abhyudaya  
**Status:** Approved — ready to build  

---

## What we are building

A shareable stakeholder demo. Fibe CPO/PM opens it, understands the integration in 5 minutes, wants to move forward. Not a pitch deck. Not a brochure. A simulation tool.

**Reference aesthetic:** BHIM Cashback-as-a-Service prototype — left panel controls, phone mockup in centre, everything simulatable. Clean, dark, no decorative copy.

---

## Architecture — 4 pages

| Route | Page name | Audience | Linked in nav? |
|---|---|---|---|
| `/` | Homepage | Fibe stakeholders | Yes |
| `/demo` | See It Working | Fibe stakeholders | Yes |
| `/revenue` | Revenue Potential | Fibe stakeholders | Yes |
| `/deck` | Pitch Deck | Internal / GC only | **No — unlisted URL only** |

Nav shows: `Homepage · See It Working · Revenue Potential`  
No link to `/deck` anywhere visible.

---

## Page 1 — Homepage `/`

**Layout: Inline. No card grid. No bento. Top-to-bottom linear.**

### Block 1 — The problem (2 sentences max)

> Fibe has 9L active borrowers and 350K monthly disbursals. Every one of them who wants a credit card leaves Fibe today to apply elsewhere.

No sub-bullets. No "Zero credit risk" copy. Just the problem.

### Block 2 — The fix (1 sentence)

> We put 100+ cards inside Fibe without touching the loan book, the approval rates, or a single line of Fibe's backend code.

### Block 3 — Revenue headline (inline, not a card)

Single number with the math shown inline, editable:

```
350,000 disbursals/month × 3% see card × 40% click × 50% approved × ₹2,000 = ₹0.42 Cr/month
```

Every multiplier is an inline editable input. Number updates as they type.  
One line below: "Conservative. See the full model →" links to /revenue.

### Block 4 — Why Great.Cards (3 bullets, inline list)

```
· 100+ cards vs the 1 IDFC First slot you have today
· Eligibility engine — recommendations pre-filtered, no user ever sees a rejection
· AI calling team — we call the leads you share, you see the commission
```

No elaboration. No moat language.

### CTA

One button → `/demo`  
Label: "See the integration →"

---

## Page 2 — See It Working `/demo`

**Layout: BHIM-style. Left panel (280px) + Phone mockup centre (375px) + Context strip right.**

### Left panel — top section (always visible)

User profile controls:
```
Credit score    [600 | 650 | 750 | 800]  toggle pills
Monthly income  [slider, ₹15K–₹2L]
Employment      [Salaried | Self-employed]  toggle
Pincode         [text input, 6-digit]
```

### Left panel — bottom section (tab switcher)

Three tabs stacked vertically, bold label + 1-line description:

```
▶ In-App Placements
  8 touchpoints inside the Fibe app

  Notification Simulator
  What gets sent, when, to whom

  Marketing Hooks
  What the user sees when a hook fires
```

Active tab highlights in teal. One tab active at a time.

---

### Tab 1 — In-App Placements

Left panel shows placement list (8 items):
```
1  Homepage widget
2  Loan declined
3  Post-disbursal thank-you
4  EMI tracker / repayment
5  Sanctioned email
6  Trending row tile (new)
7  Tailor-made offers carousel (new)
8  Play & Win LTF unlock (new)
```

Click a placement → phone updates to show that screen with live API card data.

Phone mock renders the Fibe-style UI for the selected placement using the existing working API calls:

| Placement | API call | What phone shows |
|---|---|---|
| 1 Homepage | /cards + /calculate | Category selector → 3 personalised cards |
| 2 Loan declined | /cards free_cards:true score:600 | 1 secured/builder card |
| 3 Post-disbursal | /calculate → /eligibility | Loan purpose selector → 2 cards |
| 4 EMI tracker | /cards sorted annual_savings | 2 free cards below EMI row |
| 5 Email | /calculate Travel | 2 cards in email layout |
| 6 Trending row | /cards free_cards:true | Single featured LTF tile |
| 7 Tailor-made | /cards credit_score filter | 3-card horizontal carousel |
| 8 Play & Win | /cards is_ltf_only | 3 LTF cards post-game-win |

Right strip: placement name + 1 line why it converts.

---

### Tab 2 — Notification Simulator

**This is the main feature of this tab.**

Left panel controls:
```
Cohort          [dropdown — 9 cohorts]
Today's date    [auto-populated: current date]
Day offset      [+0  +1  +3  +7  +14  +30  — click to select]
```

Phone shows:
- The exact notification (push / WhatsApp / email) for that cohort on that day
- If day is silent: phone shows lock screen with no notification, label "No message today"
- In-Journey cohort: every day is silent — phone shows "Do not disturb — user is mid-loan journey"

Right strip shows the 30-day arc for the selected cohort:
```
D+0  D+1  D+3  D+7  D+14  D+30
 ●    ○    ●    ●    ○      ●      ← green = message fires, grey = silent
```

Below arc: channel (push / WhatsApp / email), tone label, monthly volume cap.

**9 cohorts with full copy** (sourced from `05-NOTIFICATIONS-COPY.md`):

```
1. Registered, no PAN
   D0: complete profile nudge (no card yet)
   D7: "one card you'd qualify for" — soft
   D30: monthly digest

2. Registered, PAN given, no loan
   D0: welcome + free card featurette
   D3: spend-based reco
   D7: —
   D14: reminder
   D30: category reco

3. In-Journey (loan app pending)
   ALL DAYS: silent. Zero touches.

4. Approved, loan taken
   D0: thank-you + travel card
   D3: fuel / grocery card
   D7: premium card teaser
   D14: EMI-pairing card
   D30: anniversary reminder

5. Approved, no loan taken
   D0: welcome + best-fit card
   D7: category reco
   D14: —
   D30: lapsed reminder

6. Rejected, existing Fibe FD holder
   D0: FD-backed card — "you already have the FD"
   D7: reminder
   D14: —

7. Rejected, salvageable (non-FD, low-score)
   D0: credit-score builder narrative — NO card sell
   D3: explain score improvement path
   D30: re-apply reminder

8. Rejected, unsalvageable (pincode / PAN / employment)
   D0: single empathetic email, no sell
   All other days: silent

9. Credit-widget users (score viewed, no loan applied)
   D0: score-unlock narrative — "3 cards within reach at 750+"
   D14: category reco tied to score bucket
   D30: monthly score digest + 1 card
```

**Hard constraints visible in UI:**
- In-Journey = 0 touches (labelled visibly)
- Rejected non-FD = no secured card pitch ever (labelled visibly)
- Max touches per cohort shown as a pill next to cohort name

---

### Tab 3 — Marketing Hooks

Left panel shows hook list:
```
H1  EMI-on-us (first EMI paid by GC)
H2  Play & Win (FibeCoins game unlock)
H3  LTF + signup bonus
H4  Score-unlock (score improves → new card unlocked)
H5  Personalised (spend-based "card that already knows you")
H6  Referral (refer 3 friends, earn ₹3,000)
```

Hook IDs align to `04-MARKETING-HOOKS.md`: H1, H2, H3, H4, H5 (master H5 Personalised), H6 (master H8 Referral — renumbered in the 6-hook demo subset).

Click hook → phone shows what the user actually sees when that hook fires:
- The in-app notification / banner / reward screen
- The card offer that appears
- The CTA

Right strip: trigger condition (when does this hook fire), cost per card (blended), expected conversion lift.

No hook detail modals. Everything visible inline.

---

## Page 3 — Revenue Potential `/revenue`

**Layout: Inline funnel, top to bottom. No sliders. Editable inline numbers.**

### Section 1 — The funnel

Single top-down funnel, every number is an editable inline input:

```
Fibe monthly active users          [9,00,000]
↓  % who see a placement             [35%]       →  3,15,000 users
↓  % who click                        [3%]        →      9,450 users
↓  % who apply                       [60%]        →      5,670 users
↓  Bank approval rate                [50%]        →      2,835 cards/month
×  Commission per card              [₹2,000]
=  Monthly gross                                   ₹0.567 Cr
=  Annual gross                                    ₹6.80 Cr
```

Defaults load the conservative Year 1 scenario from `06-REVENUE-MODEL-VARIABLES.md`.  
One line below: benchmark context — "Paisabazaar does ~80–100K cards/year at peak."

### Section 2 — Revenue split (inline table)

```
                    Fibe share    GC share
Split 70/30         ₹4.76 Cr      ₹2.04 Cr
Split 60/40         ₹4.08 Cr      ₹2.72 Cr
Split 50/50         ₹3.40 Cr      ₹3.40 Cr
```

Split % is editable — the three rows update simultaneously.

### Section 3 — Unit economics (GC side)

Shows whether GC is unit-positive at the current inputs:

```
GC gross revenue (from above)       ₹2.04 Cr
Fixed monthly costs (editable)
  Team (callers + PM + ops)         [₹15 L/mo]
  Infra + API                       [₹2 L/mo]
Variable per card (editable)
  Caller cost / card                [₹150]
  Ops / card                        [₹150]
  Hook funding / card (blended)     [₹400]
─────────────────────────────────────────────
GC total cost / year                ₹X Cr
GC net / year                       ₹X Cr
Unit positive?                      ✓ / ✗
```

All numbers editable. Green = unit positive. Red = below unit with plain-English reason.

### Section 4 — Scenario toggle (inline, not a button grid)

Three presets as inline text links:
```
Load: [Conservative — Year 1, 3 placements]  [Realistic — Year 2, all placements]  [Aggressive — all hooks live]
```

Clicking a preset fills every editable input with that scenario's values.  
Source: `06-REVENUE-MODEL-VARIABLES.md` Presets 1, 3, 2.

---

## Page 4 — Pitch Deck `/deck`

**Unlisted. No nav link. Direct URL only.**

Content sourced from:
- `02-DECK-CXO.md` — slides 1–12
- `03-BUSINESS-PLAN-FIBE.md` — commercial terms

**Layout:** Full-screen slide view. Left/right keyboard navigation. Slide counter top-right.

No inline commentary. Clean slide format. Download PDF button top-right.

Content structure:
```
Slide 01  The IDFC monopoly — one bank, two surfaces, 9L users
Slide 02  The fix — Great.Cards inside Fibe
Slide 03  Revenue potential (links to /revenue for live calculator)
Slide 04  The 8 placements
Slide 05  Notification strategy overview
Slide 06  Rejection playbook
Slide 07  What GC provides
Slide 08  Integration architecture (webview, zero PII, 3 API calls)
Slide 09  Timeline — 2-week webview pilot
Slide 10  Commercial ask — rev share options
Slide 11  The ladder — Phase 1 → 2 → 3
Slide 12  Next step
```

---

## Design directives

**Outside the phone mock:**
- Background: `#0b1220` (dark) for demo page panels, `#f8f9fa` (light) for homepage and revenue
- No card grids. No bento. Inline lists, inline tables, inline numbers
- Font: Plus Jakarta Sans everywhere
- All revenue numbers in teal `#006767`
- Negative / red states in `#dc2626`

**Inside the phone mock (Fibe tonality):**
- Background: `#F7F8FA`
- Primary teal: `#006767`
- Bottom tab bar, Material icons, Plus Jakarta Sans
- Same Fibe-native UI the current working demo already has

**Phone mock shell:**
- Outer: `bg-slate-900 rounded-[2.75rem]`, 360px wide
- Inner: `bg-[#F7F8FA] rounded-[2.25rem]`
- Notch at top, no browser chrome

---

## What to keep from existing codebase

| File | Keep | Change |
|---|---|---|
| `server.js` | Entire file | Nothing |
| `app.js` | All API call logic, `buildRedirectUrl`, card rendering functions, state object | Remove SPA navigation (`navigateTo`, `PAGES`, `page-*` show/hide). Add router for 4 pages. |
| `public/assets/` | All card images, API assets | Nothing |
| API routes `/api/*` | All endpoints | Nothing |

The existing 5 working phone mocks plug directly into Tab 1 (In-App Placements) of the demo page. Their DOM IDs stay intact.

---

## What to discard from the previous build

- Single-scroll §0–§13 layout — gone
- Hero copy: "Zero credit risk · Zero PII shared · Zero impact on approval rates" — gone
- §8 Superpower / §9 Gallery / §11 Tech sections — discarded, not migrated
- Revenue variable model (20 sliders) — replaced by editable inline funnel
- Screenshot gallery — screenshots were UI reference, not content

---

## Non-negotiables (unchanged from original brief)

| Constraint | How it shows up |
|---|---|
| Zero PII | Bucketed score (600/650/750/800), rounded income — restated on demo page |
| No FD cards to cash-strapped rejects | Notification simulator labels this hard constraint visibly for rejected non-FD cohort |
| In-Journey = 0 notifications | Simulator shows "Do not disturb" on every day for this cohort |
| No pitch deck accessible from demo | /deck is unlisted; zero links from /, /demo, /revenue |

---

## Build order

1. Router — 4 routes with clean URL handling (no hash routing)
2. Homepage `/` — 4 inline blocks, working revenue headline calculator
3. Demo page `/demo` — BHIM layout shell, user profile controls, Tab 1 (placements) wired to existing API
4. Demo Tab 2 — Notification simulator (date + cohort + day offset → phone shows copy)
5. Demo Tab 3 — Marketing hooks (hook selector → phone shows hook UI)
6. Revenue page `/revenue` — editable funnel, split table, unit economics
7. Deck page `/deck` — slide viewer, content from docs
8. Final: verify all 5 original phone mocks render live API cards, no DOM ID conflicts
