# Fibe × Great.Cards — Build Overview

**Owner:** Abhyudaya (bkproduct@cashkaro.com)
**Last updated:** 2026-04-23
**Status:** Spec phase — do not start building until each sub-doc is approved.

---

## What we are building

Three deliverables for a single pitch to Fibe:

| # | Artifact | File | Primary audience | Purpose |
|---|---|---|---|---|
| 1 | Web prototype | `01-PROTOTYPE.md` | Fibe CPO / product team, live in stakeholder meeting | Conversational walkthrough of 8 in-app placements + notification strategy + rejection playbook |
| 2a | Pitch deck — CXO version | `02-DECK-CXO.md` | Fibe CXO / founders (10–12 slides) | Strategic "why this makes sense" — moat, ask, variable revenue |
| 2b | Pitch deck — PM version | `02-DECK-PM.md` | Fibe PM / integration lead (15–20 slides) | Tactical "how this plugs in" — placements, APIs, notification engine, SLAs |
| 3a | Business plan — internal GC | `03-BUSINESS-PLAN-INTERNAL.md` | Great.Cards leadership | Build cost, timeline, team, variable P&L |
| 3b | Business plan — external Fibe | `03-BUSINESS-PLAN-FIBE.md` | Fibe commercial / legal | Rev share, SLAs, data boundaries, migration path |
| 4 | Marketing hooks library | `04-MARKETING-HOOKS.md` | Joint product + growth | 12 hooks with unit economics per card |
| 5 | Notification copy | `05-NOTIFICATIONS-COPY.md` | Content + growth | Production-ready copy for 9 cohorts, D1 → D30 arcs |
| 6 | Revenue calculator | `06-REVENUE-MODEL-VARIABLES.md` | Abhyudaya + peers | Variable inputs + formulas. Lock scenario before pitch. |

---

## The thesis — one paragraph

Fibe has ~9L active borrowers, ~350K monthly disbursals, a CIBIL-700+ salaried prime user base, and two existing card surfaces both monopolised by IDFC First. Great.Cards can monetise the same user base across **100+ cards** without cannibalising loans, using an eligibility engine, spend-based personalisation, and an AI calling team that converts leads Fibe shares with us.

**Revenue expectations are variable, not fixed.** The business plan is dynamic — see `06-REVENUE-MODEL-VARIABLES.md`. Every input (cohort reach, conversion rate, commission, split, hook cost) is editable; the output flexes with the inputs. Benchmarks: Paisabazaar ~80–100K cards/year at peak; Fibe's realistic Year 1 range is 20K–60K cards. No static projection lives in this pack — only the calculator and its benchmarks.

---

## The problem we're solving, in Fibe's language

1. **Axis co-brand card caps you at one product.** Users who want a travel card, fuel card, LTF card, or premium card leave Fibe to apply elsewhere.
2. **~1.8M monthly applicants rejected today** — most are unmonetisable on loans but a slice is monetisable on cards (credit-score builders, FD-backed cards, self-employed-friendly cards).
3. **150K+ monthly disbursal cohort has no downstream CC funnel.** Post-disbursal is the highest-intent moment in the borrower lifecycle.
4. **Credit-score widget already lives in-app** (Media 2 screenshot) — it's a dormant top-of-funnel with no monetisation path other than "apply for a loan again."

---

## The rejection puzzle — our working answer

Fibe's rejections are **not** the usual "bad credit" kind. Fibe rejects on:

- Pincode (Fibe covers most India → if they reject here, banks also reject)
- Salary below ~₹15K (Fibe's bar is already lower than banks → banks definitely reject)
- PAN mismatch (no product can be offered until KYC is fixed)
- Employment type (self-employed rejected — but some banks have self-employed-friendly products)
- Credit score too low
- Overleveraged

**Implication:** we cannot monetise ~90% of rejects today. Our playbook for the salvageable ~10%:

1. **Credit-score builder narrative** — Fibe already has the "Decode your credit score" widget (Media 2). Rejected user sees: "Want to be approved next time? Build credit with an FD-backed card, ₹10K lock-in, unlock loan eligibility in 6 months." This is a **ladder back to Fibe**, not away from it.
2. **FD-backed cards for existing Fibe FD holders** — Fibe sells FDs (Media 4, "Fixed Deposits up to 9% p.a."). Users who already parked money in Fibe FD are pre-qualified and NOT cash-strapped. This is the real FD-card cohort — not the freshly-rejected-loan cohort.
3. **Self-employed-friendly cards** for employment-type rejects.

Rejected-loan applicants who have zero liquid capital are explicitly **not a target** — we do not pitch secured cards to cash-strapped users. This constraint is hard-coded into the notification matrix.

---

## Non-negotiable constraints

| Constraint | Source | How it shows up in the build |
|---|---|---|
| Zero PII exposure | Existing `buildRedirectUrl()` in `app.js` — bucketed score, rounded income | Every revenue-model screen restates this |
| Fibe tonality inside phone mocks, enterprise outside | User directive | Hero, context strips, commentary = enterprise; phone UI = Fibe teal `#006767`, Plus Jakarta Sans, bottom tab bar, Material icons |
| Do not disturb In-Journey users | User directive (boss feedback) | Notification matrix explicitly shows 0 touches for this cohort |
| No FD cards to cash-strapped rejected-loan users | User directive | Rejection-screen phone mock must not recommend FD cards; separate FD-card flow gated on "existing Fibe FD holder" check |
| Keep existing IDs and backend intact | Implicit — the working demo must not break | All `homeCategoryGrid`, `rejectionCardsContainer`, etc. stay; only wrapper + new sections added |

---

## Reading order

For Fibe stakeholders: `01-PROTOTYPE.md` (live demo) → `02-DECK-CXO.md` (on screen during meeting) → `03-BUSINESS-PLAN-FIBE.md` (leave-behind).

For Great.Cards internal review: `03-BUSINESS-PLAN-INTERNAL.md` → `01-PROTOTYPE.md` → `02-DECK-PM.md`.
