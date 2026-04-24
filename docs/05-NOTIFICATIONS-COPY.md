# Fibe × Great.Cards — Notification Strategy

**Version:** v1.0 Final (build-ready)
**Owner:** Fibe Growth × Great.Cards Partnerships
**Status:** Prototype spec. Real P&L sign-off + compliance review at integration time.

---

## Core Rules (apply to every cohort)

1. **Never pitch a Fibe product *inside* a card message.** The loan moment is context, not cross-sell. Card message stays card-only.
2. **Always name the card.** "A credit card" is dead. "HDFC Millennia" converts.
3. **One ₹ number per push.** No more. Pick the highest one.
4. **Push = 2 sentences max.** Single card, single ₹, single CTA.
5. **No email before Day 3.** Anything faster reads as automated.
6. **Never promise pre-approval** unless the issuer API confirms it explicitly.
7. **Global frequency cap:** max 6 messages across all active cohorts per 7-day rolling window. Daily channel cap: 1 push + 1 email per user per day.

---

## Channels

| Channel | Purpose | Rule |
|---|---|---|
| Push | Discovery, triggers, re-engagement | 2 sentences, 1 card, 1 ₹ |
| Email | Math, full shortlist, mechanic explanation | D4, D7, D22 sweet spots — never before D3 |
| SMS | Phase 2 only | H1 post-disbursal, after push CTR ceilings are measured |

---

## Fallback Rules (personalization)

Every bracketed variable must resolve to a named fallback. Pipeline order:

1. **Null returned** → substitute default card (below)
2. **Card returned but fails eligibility** (income / score / employment / existing-customer) → re-run against next-best eligible card from init bundle
3. **No eligible card found** → suppress message entirely. Never ship a bracket.

### Default card map

| Variable | Fallback |
|---|---|
| `[Spend-matched card name]` | HDFC MoneyBack+ |
| `[₹ savings/yr]` | ₹12,000/yr |
| `[Top card name]` | Axis Ace |
| `[Top 3 cards]` | Axis Ace · HDFC MoneyBack+ · SBI SimplyClick |
| `[Complementary stacking card]` | SBI Cashback |

### Monitoring thresholds

- **Fallback rate > 20%** in any cohort over a 24-hour window → flag + pause sends until pipeline reviewed.
- **Suppression rate > 15%** in any cohort over a 24-hour window → flag + pause. Tracked separately from fallback (dead users, not degraded copy).

---

## Conflict Resolution

**Cross-channel:** push and email never conflict. A C9 trigger push and a C2 scheduled email on the same day both send.

**Same-channel (two pushes same day):**
1. Trigger-based beats scheduled. Scheduled push defers.
2. Deferred push has a **max 48-hour defer window.** After that, dropped — not sent stale.

**Exempt from displacement** (these emails always fire as scheduled):
- C2 D7 email
- C4 D7 email
- C6 D7 email

**Exempt-vs-exempt tiebreaker:** when two exempt emails compete on the same day, send the cohort the user entered most recently (freshest intent signal).

**C4 sequence:** entire D1–D30 arc is exempt from the 7-day rolling cap. Post-disbursal is time-locked to a single lifecycle event that does not recur. Daily channel cap still applies — **except C4 D1 +2hrs push, which is exempt from both daily and weekly caps.** That message is the highest-value trigger in the system.

---

## Cohort 1 — Registered, No PAN

**Persona:** Just signed up. Card-curious. PAN not uploaded.
**Cap:** 7 messages over 30 days.
**Tone:** Card-as-hero. PAN is the mechanic, never the ask.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | 10 AM | Push | Your 3 cards are ready | Axis Ace · HDFC MoneyBack+ · SBI SimplyClick. All lifetime free. 90 seconds to claim. | Claim my 3 |
| D2 | 11 AM | Push | HDFC MoneyBack+ · 5% on Amazon & Flipkart | LTF. ₹500 welcome bonus on first ₹1,000. Your online spend pays for itself. | See card |
| D4 | 8 PM | Email | 5 credit cards you qualify for — here's why each matches | Full shortlist, named cards, LTF framing, 2-min apply path. | Claim my 5 |
| D7 | 6 PM | Push | Aarav in Malad just got Axis Ace | Lifetime free. ₹500 back on first spend. 90 seconds. | See matching cards |
| D10 | 10 AM | Push | SBI SimplyClick ₹2,000 sign-on — ends this month | Bank-funded voucher. LTF. Real campaign, not a teaser. | Apply before it ends |
| D22 | 7 PM | Email | 6 cards hand-picked for your spend — save up to ₹18,400/yr | ₹ savings per category per card. LTF only. Math, not marketing. | See all 6 |
| D30 | 9 AM | Email | Still looking? 3 LTF cards · 2 minutes · nothing to lose | Axis Ace, HDFC MoneyBack+, SBI SimplyClick. Three names. Final close. | Pick 1 of 3 |

**Dropped from original 11:** D1-6PM (same-day double push kills trust pre-PAN), D3 score preview (C9 territory), D14 LTF reminder (redundant with D10), D18 peer-picks (identity framing has no credibility pre-PAN).

---

## Cohort 2 — Registered + PAN, No Loan, No Card

**Persona:** PAN verified. High intent, no action yet.
**Cap:** 9 messages over 30 days.
**Tone:** Spend-matched from Day 1. Never generic.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | 9 AM | Push | PAN verified ✓ — your top spend card is ready | `[Spend-matched card]` · `[₹ savings/yr]`. Pre-matched. Fallback: HDFC MoneyBack+, ₹12K/yr. | See my card |
| D2 | 11 AM | Push | Save ₹18,400 on fuel this year | HDFC IndianOil — 5% on fuel, 5% on groceries. Profile-matched. | See the card |
| D3 | 6 PM | Push | Your online spend × 5% = ₹12,000/yr | Amazon Pay ICICI — 5% on Amazon. LTF for Prime members. | See card |
| D5 | 10 AM | Push | SBI Cashback · 5% on ALL online spends | No category caps. ₹2,000 monthly ceiling. Bills, OTT, shopping — all 5%. | Apply |
| **D7** | **8 PM** | **Email** | **One card. ₹25,000 back a year. Here's the math.** | **Line-by-line spend × reward rate = annual ₹ outcome. Fee handled head-on.** | **Apply to SBI Cashback** |
| D10 | 11 AM | Push | 1,00,000 reward points in month 1 | HDFC Regalia Gold — spend ₹50K, get ₹25K in flights & hotels. Salaried ₹60K+? Eligible. | See card |
| D14 | 10 AM | Push | 3 lifetime free cards, picked for you | Zero joining. Zero annual. 2-minute apply. Approval in 3 days. | See all 3 |
| D21 | 11:30 AM | Push | 0% EMI on 10K+ merchants | Axis Ace + Bajaj EMI network = zero interest on phones, electronics, insurance. | See 0% EMI cards |
| D30 | 11 AM | Push | Your top-savings card — based on 30 days in the app | `[Highest-saving card]` saves you `[₹X]`/yr. Fallback: SBI Cashback, ₹15K/yr. | See card |

**D7 email = exempt from displacement. Highest-conviction content in cohort.**

---

## Cohort 3 — In-Journey (Loan Pending)

**Cap:** ZERO. Non-negotiable.

Breaking silence at loan decision moment destroys trust and the cross-product funnel. No exceptions. No A/B test. No "just one message."

---

## Cohort 4 — Approved + Loan Taken

**Persona:** Disbursal complete. Highest emotion. Peak wallet-share moment.
**Cap:** 8 messages over 30 days. Full sequence exempt from 7-day rolling cap. D1 +2hrs exempt from daily cap also.
**Tone:** Celebratory → quietly useful → data-as-gift. Never salesy.
**Funding:** ₹1,500 EMI-on-us absorbed from commission earned on card issuance. Self-funding unit model.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| **D1** | **+2hrs** | **Push** | **₹1,50,000 credited ✓ One more thing —** | **Swipe ₹10K in 30 days — we pay your next EMI. Up to ₹1,500.** | **Claim the card** |
| D2 | 10 AM | Push | HDFC Millennia — the card behind your EMI offer | 2.5% cashback on Amazon, Swiggy, Zomato. ₹10K spend → ₹1,500 EMI credit. | See card |
| D3 | 11 AM | Push | 0% EMI on your next phone | HDFC card = zero interest on 10K+ partner merchants. Stop paying 3× on the next big purchase. | See cards |
| D5 | 8 PM | Push | HDFC Regalia Gold · 1L points on ₹50K spend | ₹25,000 in flights + hotels. Your income qualifies. | Apply |
| **D7** | **8 PM** | **Email** | **1 lakh points in month 1 — real math** | **Full reward breakdown: base + milestone + multiplier = ₹25K redemption. Fee catch included.** | **Apply to Regalia Gold** |
| D10 | 11 AM | Push | Rewards = 1 free EMI | ₹40K/mo × 2% × 3 months = ₹2,400 = one EMI paid by card rewards. | See cards |
| D18 | 9 AM | Push | Next loan? Take the card with it — fees waived | Bundle deal: next personal loan + card = ₹1,249 in fee waivers. | See combo |
| D30 | 10 AM | Email | Month 1 projection · card rewards could cover 16% of your EMI | Based on your income band, a card user like you earns roughly ₹2,400 in month 1. By month 6, rewards cover a full EMI. | See full trajectory |

**D1 +2hrs is priority #1 in the entire system. Get this right above everything else.**
**D7 email = exempt from displacement.**
**D30 reframed as income-band projection — no fabricated actuals.**

---

## Cohort 5 — Approved, No Loan Taken

**Persona:** Got approved. Walked away. Eligibility already cleared.
**Cap:** 5 messages.
**Tone:** Eligibility as an asset, not a guilt trip.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | 11 AM | Push | Approved — but didn't need the cash? | Take a lifetime-free card instead. Same eligibility. Zero fee. ₹500 back on first spend. | Claim card |
| D3 | 7 PM | Push | You qualify for HDFC Regalia Gold — 1L points | Same income you proved on the loan = ₹25K in flights & hotels. | Apply |
| D7 | 10 AM | Push | Based on your declared spend — save ₹18,400/yr | HDFC IndianOil. 5% on fuel. LTF. Eligibility already cleared. | See card |
| D14 | 8 PM | Email | No loan? Take a card — same eligibility you already cleared | 3 named LTF cards. Zero new KYC. 2-minute apply. | Pick one |
| D30 | 10 AM | Push | Loan OR card — your call | Both products. Same app. Same eligibility. No pressure. | See both |

---

## Cohort 6 — Rejected, Fibe FD Holder

**Persona:** Rejected on loan. Has FD. Honest FD-card path.
**Cap:** 6 messages.
**Tone:** "Your FD earned this." Never "rejected." Objection killed at D3.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | 11 AM | Push | Your FD is working harder than you think | ₹50,000 in Fibe FD = credit card against it. FD keeps earning. Card gives credit. | See FD-backed cards |
| D3 | 10 AM | Push | You don't break the FD. You don't lose interest. | ₹50K FD = ₹50K credit line. FIRST EARN or Axis Insta. Bank approves most in 24 hours. FD stays at 7.5%. | See how it works |
| D5 | 8 PM | Push | ₹50K FD = ₹50K credit line · zero joining fee | FIRST EARN or Axis Insta — 1:1 credit. Bank approves most FD-backed apps in 24 hours. | Apply |
| **D7** | **8 PM** | **Email** | **Your Fibe FD just became a credit card** | **3 FD-backed cards, named. 24-hr typical approval. FD continues earning 7.5%. 6-month score-lift data included.** | **Pick 1 of 3** |
| D14 | 11 AM | Push | Approval ready · secured card can issue today | Bank approves most FD-backed applications within 24 hours. | Complete · 1 min |
| D21 | 10 AM | Push | FD card users: credit score +40–80 in 6 months | Based on Great.Cards secured-card data (10K+ users). That's the gap to unsecured eligibility. | Start the ladder |

**D7 email = exempt from displacement. Highest conversion rate of any rejected cohort.**
**"Guaranteed" replaced with "bank approves most within 24 hours" throughout — regulatory safe.**

---

## Cohort 7 — Rejected, Salvageable (Low Score, No FD)

**Persona:** Score 640. Target 720. No liquidity. Needs a plan, not a pitch.
**Cap:** 6 messages.
**Tone:** One sentence of empathy. Then agency. Never "rejected."

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | 11 AM | Push | We know that wasn't the answer you wanted. | Here's the 6-month playbook. One card, three habits, loan-eligible by month 6. | See the plan |
| D3 | 10 AM | Push | Your score: 640 · target: 720 · gap: 80 points | Most users close this in 4–6 months with a secured card + on-time payments. | See the playbook |
| D7 | 8 PM | Email | The reason we said no — and the fix. | Plain-language rejection reason. Specific FIRST EARN card. Three behaviour steps. Based on Great.Cards secured-card data (10K+ users, 6-month window): average +47 points, median +56. "Not a sales pitch." No follow-up if ignored. | Start the plan — ₹10K FD |
| D14 | 9 AM | Push | Month 1 of your score plan | You haven't started yet. Sooner you begin, sooner you're loan-eligible. | Start today |
| D21 | 11 AM | Push | FIRST EARN — 24hr approval · ₹10K FD | Lowest-friction secured card in the Fibe app. FD earns 7.5% while it works. | Apply |
| D30 | 10 AM | Push | Check-in: how's month 1 going? | Start today, check-in month 3. Score up = unsecured options open. | Keep going |

**D7 stat attribution:** "Based on Great.Cards secured-card data (10K+ users, 6-month window)." GC portfolio data, citable.

---

## Cohort 8 — Rejected, Unsalvageable (Pincode Not Served)

**Cap:** 1 email + reactive trigger only.
**Tone:** Radically honest. Brand equity play.

**Email:** Specific pincode named (e.g. 400088). Exact reason stated. Acknowledge other lenders will likely say the same. Three honest options. Explicit promise of no follow-up spam. No CTA.

**Reactive trigger (Phase 2):** Nightly batch re-runs rejected pool against GC coverage API (`/api/city/:pincode` endpoint already exists in codebase). When user's pincode enters service area, fire one push only:

> **Good news — we now serve your area. Your application can reopen.**

No further cadence after this trigger. One push, one chance.

**This is the best brand-equity play in the system. Do not water it down.**

---

## Cohort 9 — Credit Widget Users (Score Viewed, No Action)

**Persona:** Score checked. Dormant top-of-funnel.
**Cap:** 8 messages across a year, fired on score-bucket changes only.
**Tone:** Zero-spam. Real-time trigger. Always one concrete card.
**Buckets:** 50-point bands aligned to existing `bucketScore()` — 600→650, 650→700, 700→750, 750→800.

| Trigger | Channel | Headline |
|---|---|---|
| 700→750 shift | Push | Your score just unlocked 3 new cards |
| 700→750 shift (follow-up) | Push | 750 is the band where you save ₹20K+/yr |
| 750→800 shift | Push | You're in premium territory — 3 picks |
| D7 post-shift | Push | Your score at 750 = ₹12,000 cashback/yr missed |
| D14 post-shift | Email | Score ↑ means new cards unlocked · your shortlist |
| Monthly | Push | Score digest · 1 card matched this month |
| D60 | Push | Still eligible — same 3 cards, 2-minute apply |
| D90 | Push | Your score vs your spend: ₹22,400/yr on the table |

---

## Cohort 10 — Repeat Loan Taker *(new)*

**Persona:** Second or subsequent loan. Highest trust, shortest path. Highest LTV, highest issuer approval rate.
**Cap:** 3 messages, 30 days.
**Tone:** Welcome back. No re-introduction needed.

| Day | Time | Channel | Headline | Body | CTA |
|---|---|---|---|---|---|
| D1 | +2hrs | Push | You're back — 3 cards matched to your profile | `[Top 3 cards]` for their income + score. No pitch. Just the shortlist. Fallback: Axis Ace · HDFC MoneyBack+ · SBI SimplyClick. | See my 3 |
| D14 | 10 AM | Push | `[Card name]` — your first bill arrives around 30 days after activation | Paying in full every cycle builds your score fastest. | See card |
| D30 | 8 PM | Email | Your loan + a card together — here's what changes | Income-band projection: rewards offset against their actual loan EMI. H12 framing. | See the math |

**D14 reframed as timing-agnostic** — no issuer statement-cycle data required. Ships today. GC application-callback version = Phase 2.
**Priority #2 in the entire system.** Repeat borrowers have pre-built trust, shortest sales cycle.

---

## Cohort 11 — Dormant 90+ Days *(new)*

**Cap:** 1 email only. **No push** — dormant tokens expire, push trains OS suppression.
**Tone:** No guilt. One concrete card. One ₹ number. Three sentences max before CTA.

**Email structure:**
- Single card name (from declared spend category, fallback HDFC MoneyBack+)
- Single ₹ savings figure (annual)
- Single CTA
- No "we miss you." No recap. No guilt.

---

## Cohort 12 — Time-Based Card Holder Re-engagement *(new)*

**Trigger:** 6 months after `card_issued_date`
**Cap:** 1 message per 6-month window.
**Tone:** Additive, not replacement. "Stack on top of what you have."

| Trigger | Channel | Headline | Body | CTA |
|---|---|---|---|---|
| 6-month mark | Push | 6 months in — here's a card that stacks on yours | `[Complementary stacking card]` for a category their current card doesn't cover. Fallback: SBI Cashback. | See stacking card |

**No spend data assumed.** Category inference from loan-app declarations only. Spend-based re-engagement = Phase 2 (requires issuer feed Fibe does not own).

---

## Priority Order (by revenue impact)

1. **Cohort 4, D1 +2hrs** — highest emotion window. H1 EMI-on-us. Get this right first.
2. **Cohort 10** — repeat borrowers. Highest LTV, highest issuer approval rate, shortest cycle.
3. **Cohort 2, D7 email** — PAN-verified dormant. Spend-math = highest-conviction content.
4. **Cohort 9 score-triggers** — zero-spam, compounding. Best long-term CAC.
5. **Cohort 6, D7 email** — FD holders convert best of any rejected cohort. Underrated.

---

## Phase 2 (data dependency — don't build yet)

| Item | Blocker | Ship condition |
|---|---|---|
| SMS on H1 (C4 D1) | Cost vs. push CTR ceiling | Ship push first, measure. Add SMS only if push saturates. |
| Issuer pre-approval cohort | GC API doesn't return per-user pre-approval flag today | GC API extension |
| C8 reactive trigger | Nightly batch job not built; `/api/city/:pincode` endpoint exists | Batch runner + rejected-pool table |
| C10 D14 statement-date copy | Issuer statement-cycle data not available to Fibe | GC application-callback integration |
| C12 spend-based re-engagement | Issuer card-spend feed not available | Issuer data partnership |
| Cohort state-machine / exit routing | Not specified in v1 | Add before month 4 of production to prevent combinatorial drift |

---

## Changelog

**v1.0 (Final, build-ready)**
- 12 cohorts (was 9 — added Repeat Loan, Dormant 90+, Time-Based Holder)
- Cohort 1 trimmed 11 → 7 (pre-PAN trust protection)
- Cohort 4 D30 reframed as income-band projection (no fabricated spend data)
- Cohort 6 "guaranteed" language replaced throughout (regulatory)
- Cohort 7 D7 stat attributed to Great.Cards secured-card portfolio data
- Cohort 8 reactive trigger scoped to Phase 2
- Cohort 9 triggers aligned to 50-point bands (matches `bucketScore()`)
- Cohort 10 D14 reframed as timing-agnostic
- Three-step fallback logic for all personalized fields
- Global frequency cap + conflict resolution table
- C4 full sequence exempt from 7-day cap; D1 +2hrs exempt from daily cap
- Exempt-from-displacement emails: C2 D7, C4 D7, C6 D7

**Open for Phase 2:** 6 items above. None block v1 ship.
