# Notification Simulator — Full Copy Export

Source of truth: `public/app.js` — `COHORTS` (line 1463) and `HOOKS` (line 1925).
This file is for independent copy review. Edit copy here, sync back to `app.js`.

- **9 cohorts** (one silent by design).
- **12 hooks**, with `phase1` flag marking the pilot stack.
- Messages reference hooks via `H<id>` tags; hook ↔ cohort appearance is auto-wired in the UI.

Hook legend: H1 EMI on us · H2 Play & Win · H3 LTF + ₹500 · H4 Score unlock · H5 Personalised · H6 Card + loan combo · H7 FD → unsecured ladder · H8 Referral · H9 Salary match · H10 0% EMI · H11 1L points · H12 Rewards pay EMI.

---

## Cohorts

### Cohort 1 — Registered, no PAN
- **Persona**: Just signed up. PAN not uploaded. Card-curious.
- **Cap**: 11 messages over 30 days — PAN-unlock focused.

**M1 · Day 1 · 10:00 AM · push · H3**
- Title: 3 credit cards pre-matched to you
- Body: Axis Ace · HDFC MoneyBack+ · SBI SimplyClick. All lifetime free. Verify PAN in 90 sec to apply.
- CTA: Verify PAN · unlock cards
- Why: Lead with the card outcome, not the PAN ask. Three specific card names = trust.

**M2 · Day 1 · 6:00 PM · push · H3**
- Title: Axis Ace · ₹500 cashback on your first spend
- Body: Lifetime free. Zero joining fee. Zero annual fee. 2% back on bills and rides.
- CTA: Apply now
- Why: Same-day second push — a concrete card, not a category. Reinforces Day 1 #1.

**M3 · Day 2 · 11:00 AM · push · H3**
- Title: HDFC MoneyBack+ · 5% on Amazon & Flipkart
- Body: If you shop online, this is the card. LTF. ₹500 welcome bonus on first ₹1,000.
- CTA: See card details
- Why: Category-specific framing. Shifts focus from "a card" to "your card."

**M4 · Day 3 · 9:00 AM · push · H4**
- Title: Your free credit score — no PAN needed to peek
- Body: See where you stand. 750+ unlocks premium cards. 60 seconds.
- CTA: See my score
- Why: Day 3 — zero-commitment action. Score preview drives later card eligibility check.

**M5 · Day 4 · 8:00 PM · email · H3**
- Subject: 5 credit cards you qualify for — here's why each matches
- Preheader: Lifetime free. Personalised. 2-minute apply.
- Body:
  > Hey,
  >
  > Based on your profile (salaried, income band declared at signup), here are 5 cards you qualify for — all with the lowest friction:
  >
  > 1. Axis Ace — LTF, 2% cashback on bills + rides
  > 2. HDFC MoneyBack+ — LTF, 5% on Amazon & Flipkart
  > 3. SBI SimplyClick — LTF, 10× rewards on online spends
  > 4. ICICI Platinum Chip — LTF, PAYBACK points on every spend
  > 5. Kotak League Platinum — LTF, 4× rewards on dining
  >
  > All zero joining fee. All zero annual fee. All lifetime free.
  >
  > Verify PAN (90 seconds) and apply in 2 minutes. Bank approval in 3 working days.
- CTA: Verify PAN · see my 5
- Why: Email = space for the full shortlist. Named cards beat generic "10+ banks." Card-first, Fibe incidental.

**M6 · Day 7 · 6:00 PM · push · H3**
- Title: Aarav in Malad just got Axis Ace
- Body: Lifetime free. ₹500 back on first spend. Verify PAN to see your match.
- CTA: See matching cards
- Why: Social proof via fictional-but-plausible neighbour. Mumbai-coded.

**M7 · Day 10 · 10:00 AM · push · H3**
- Title: Expiring: SBI SimplyClick ₹2,000 sign-on
- Body: Bank is running a ₹2,000 Amazon voucher for new SimplyClick users. Ends this month.
- CTA: Apply before it ends
- Why: Bank-funded scarcity (real campaign). LTF + bonus.

**M8 · Day 14 · 11:00 AM · push · H3**
- Title: 3 lifetime free cards · 60 seconds · no fees
- Body: Zero joining. Zero annual. Pick 1.
- CTA: See all 3
- Why: LTF framing, speed claim. Low-cognition push.

**M9 · Day 18 · 8:00 PM · push · H9**
- Title: Salaried at ₹60K+? 3 cards your peers use
- Body: HDFC Regalia First · Axis MyZone · SBI Prime. Peer-tier recommended.
- CTA: See peer picks
- Why: Identity framing — "what people at your salary use." Strongest motivator for aspirationals.

**M10 · Day 22 · 7:00 PM · email · H5**
- Subject: 6 cards hand-picked for your profile — save up to ₹18,400/yr
- Preheader: Personalised math, not marketing.
- Body:
  > Here's the full shortlist for your income band and declared spend categories:
  >
  > HDFC IndianOil — if fuel ≥ ₹8K/mo → ₹18,400 saved/yr
  > Amazon Pay ICICI — if Amazon ≥ ₹15K/mo → ₹12,000 back/yr
  > Axis Ace — bills + rides → ₹7,200 back/yr
  > HDFC MoneyBack+ — general online → ₹8,500 back/yr
  > SBI Cashback — 5% on all online → ₹15,000 back/yr
  > Kotak League — dining ≥ ₹5K → ₹6,500 back/yr
  >
  > All LTF (zero joining, zero annual). Tap any card → apply in 2 minutes.
- CTA: See all 6
- Why: Specific ₹ outcomes per card = conviction. Math beats promises.

**M11 · Day 30 · 9:00 AM · email · H3**
- Subject: Still looking? 3 LTF cards are ready in 2 minutes
- Preheader: Zero fees. Pre-matched. Nothing to lose.
- Body:
  > Axis Ace, HDFC MoneyBack+, SBI SimplyClick.
  >
  > All three: lifetime free. All three: no annual fee ever. All three: you qualify.
  >
  > Verify PAN (90 sec) → pick one → bank approval in 3 days.
  >
  > No pitch. Just the three we'd pick for someone with your profile.
- CTA: Pick 1 of 3
- Why: Day 30 final — three concrete names, no abstraction. LTF is the lowest-friction close possible.

---

### Cohort 2 — Registered + PAN, no loan, no card
- **Persona**: PAN verified. Exploring. High intent, no action yet.
- **Cap**: 9 messages over 30 days — spend-matched reco.

**M1 · Day 1 · 9:00 AM · push · H3**
- Title: PAN verified ✓ Here are your 3 best cards
- Body: Axis Ace · HDFC MoneyBack+ · SBI SimplyClick. All LTF. All pre-matched.
- CTA: See my 3
- Why: PAN verification = immediate unlock of concrete cards. Don't waste the moment.

**M2 · Day 2 · 11:00 AM · push · H5**
- Title: Save ₹18,400 on fuel this year
- Body: HDFC IndianOil card — 5% on fuel, 5% on groceries. Profile-matched.
- CTA: See the card
- Why: Specific ₹, specific card. Spend-based reco via /calculate data.

**M3 · Day 3 · 6:00 PM · push · H5**
- Title: Your online spend × 5% = ₹12,000/yr
- Body: Amazon Pay ICICI card — 5% on Amazon. LTF for Prime members.
- CTA: See card
- Why: Different category, different hero card. Keeps the reco catalog wide.

**M4 · Day 5 · 10:00 AM · push · H3**
- Title: SBI Cashback Credit Card — 5% on ALL online spends
- Body: No category caps. ₹2,000 monthly cap. Bills, shopping, OTT — all 5% back.
- CTA: Apply
- Why: Specific card, specific USP. "All online" removes the category-pick cognitive load.

**M5 · Day 7 · 8:00 PM · email · H5**
- Subject: One card. ₹25,000 back a year. Here's the math.
- Preheader: Personalised to how you actually spend.
- Body:
  > Based on your declared spend pattern:
  >
  > Amazon ₹10K/mo × 5% = ₹6,000/yr
  > Fuel ₹5K/mo × 5% = ₹3,000/yr
  > Bills ₹5K/mo × 2% = ₹1,200/yr
  > Groceries ₹8K/mo × 3% = ₹2,880/yr
  > Dining ₹4K/mo × 5% = ₹2,400/yr
  > Other online ₹5K/mo × 2% = ₹1,200/yr
  >
  > = ₹16,680/yr cashback.
  >
  > Add sign-up bonus (₹2,000) + annual fee waiver (₹999) = ₹19,679/yr net benefit.
  >
  > SBI Cashback Credit Card. Joining fee ₹999, waived on ₹2L annual spend (you'll hit that).
- CTA: Apply to SBI Cashback
- Why: Math beats promise. Specific ₹ per category = credibility. Addresses the joining fee head-on.

**M6 · Day 10 · 11:00 AM · push · H11**
- Title: 1,00,000 reward points in month 1
- Body: HDFC Regalia Gold — spend ₹50K, get ₹25K in flights & hotels. Salaried at ₹60K+? Eligible.
- CTA: See card
- Why: Premium card push. Big numbers break banner fatigue.

**M7 · Day 14 · 10:00 AM · push · H3**
- Title: 3 lifetime free cards, picked for you
- Body: Zero joining. Zero annual. 2-minute apply. Approval in 3 days.
- CTA: See all 3
- Why: LTF reminder. Frictionless close.

**M8 · Day 21 · 11:30 AM · push · H10**
- Title: 0% EMI on 10K+ merchants
- Body: Axis Ace + Bajaj EMI network = zero interest on phones, electronics, insurance.
- CTA: See cards with 0% EMI
- Why: EMI-mindset user — reframe card as cheaper financing than a loan.

**M9 · Day 30 · 11:00 AM · push · H5**
- Title: Your top-savings card this month
- Body: Based on 30 days of your in-app behaviour, SBI Cashback saves you ₹15K+/yr.
- CTA: See card
- Why: Data-personalisation close. The "we've watched you" unlock no aggregator can match.

---

### Cohort 3 — In-Journey (loan pending)
- **Persona**: Loan applied. Decision pending.
- **Cap**: ZERO · non-negotiable.
- **Status**: SILENT.
- **Silent reason**: Breaking silence at loan decision moment destroys trust and cross-product funnel. Zero card messaging.

---

### Cohort 4 — Approved + loan taken
- **Persona**: Disbursal complete. Highest emotion. Peak wallet-share.
- **Cap**: 8 messages over 30 days — celebratory, EMI-framed.

**M1 · Day 1 · 2hr post-disbursal · push · H1**
- Title: ₹1,50,000 credited ✓ One more thing —
- Body: Swipe ₹10K on this card in 30 days — we pay your next EMI. Up to ₹1,500.
- CTA: Claim the card
- Why: H1 EMI-on-us. 2-hour delay = money has landed. Psychological peak for bundle cross-sell.

**M2 · Day 2 · 10:00 AM · push · H1**
- Title: HDFC Millennia — the card behind your EMI offer
- Body: 2.5% cashback on Amazon, Swiggy, Zomato. ₹10K spend → ₹1,500 EMI credit.
- CTA: See card
- Why: Name the actual card. H1 promise is abstract unless the card is concrete.

**M3 · Day 3 · 11:00 AM · push · H10**
- Title: 0% EMI on your next phone
- Body: HDFC card = 0% interest on 10K+ partner merchants. Stop paying 3× on the next big purchase.
- CTA: See cards
- Why: H10. Reframes card as smarter financing than a loan for their NEXT need.

**M4 · Day 5 · 8:00 PM · push · H11**
- Title: HDFC Regalia Gold · 1L points on ₹50K spend
- Body: ₹25,000 in flights + hotels. Your income qualifies.
- CTA: Apply
- Why: H11 premium signup bonus. Approved-active cohort has income validated.

**M5 · Day 7 · 8:00 PM · email · H11**
- Subject: 1 lakh points in month 1 — real math
- Preheader: Spend ₹50K, earn ₹25K worth of rewards. Not marketing.
- Body:
  > HDFC Regalia Gold signup bonus breakdown:
  >
  > Base bonus: 2,500 reward points (worth ₹500 on flights)
  > Spend milestone: ₹50K in 30 days → 5,000 bonus points
  > Category multiplier: 4× on travel, dining → 92,500 extra points
  >
  > Total: ~1,00,000 reward points on ₹50K spend.
  > Redemption value at 1 point = ₹0.25 on travel = ₹25,000.
  >
  > Catch-check: ₹2,500 joining fee, waived on ₹3L annual spend.
  >
  > Who this is for: anyone at ₹1L+ salary who travels ≥ 2 flights/year.
- CTA: Apply to Regalia Gold
- Why: Math breakdown > claim. Specific redemption math = trust.

**M6 · Day 10 · 11:00 AM · push · H12**
- Title: Rewards = 1 free EMI
- Body: ₹40K/mo × 2% × 3 months = ₹2,400 = one EMI paid by card rewards alone.
- CTA: See cards
- Why: H12. Ties card value directly to loan relief.

**M7 · Day 18 · 9:00 AM · push · H6**
- Title: Next loan? Take the card with it — fees waived
- Body: Bundle deal: next personal loan + credit card together = ₹1,249 in fee waivers.
- CTA: See combo
- Why: H6. Pre-qualify them for the NEXT loan-card bundle while they're active.

**M8 · Day 30 · 10:00 AM · email · H12**
- Subject: Month 1 report · your card rewards covered 0.8 of your EMI
- Preheader: Here's your real savings trajectory.
- Body:
  > Your card spend this month: ₹38,400
  > Rewards earned: 2% × ₹38,400 = ₹768
  > EMI this month: ₹4,850
  >
  > Card rewards covered 16% of your EMI.
  >
  > At this pace, by month 6 your cumulative rewards = 1.2× your monthly EMI. Month 7 onward, rewards pay a full EMI each month.
  >
  > No action needed. Just keep using the card like you are.
- CTA: See full trajectory
- Why: Data-as-gift. Progress reporting = stickiness. Frames card as an investment, not a cost.

---

### Cohort 5 — Approved, no loan taken
- **Persona**: Got approved. Walked away. Eligibility already cleared.
- **Cap**: 5 messages.

**M1 · Day 1 · 11:00 AM · push · H3**
- Title: Approved — but didn't need the cash?
- Body: Take a lifetime-free card instead. Same eligibility. Zero fee. ₹500 back on first spend.
- CTA: Claim card
- Why: Reuse their cleared eligibility — zero incremental KYC.

**M2 · Day 3 · 7:00 PM · push · H11**
- Title: You qualify for HDFC Regalia Gold — 1L points
- Body: Same income you proved on the loan = qualified for ₹25K in flights & hotels.
- CTA: Apply
- Why: Your eligibility is fresh — leverage for a premium upgrade ask.

**M3 · Day 7 · 10:00 AM · push · H5**
- Title: Based on your declared spend — save ₹18,400/yr
- Body: HDFC IndianOil card. 5% on fuel. LTF. Pre-approved.
- CTA: See card
- Why: Personalised reco using loan-app spend declarations.

**M4 · Day 14 · 8:00 PM · email · H3**
- Subject: No loan? Take a card — same eligibility you already cleared
- Preheader: LTF + ₹500 signup bonus. Pre-approved.
- Body:
  > You passed Fibe's approval for a loan last week but didn't draw it. Your eligibility is still live.
  >
  > Three cards you qualify for instantly (no new KYC):
  >
  > 1. Axis Ace — LTF, 2% on bills + rides
  > 2. HDFC MoneyBack+ — LTF, 5% on Amazon & Flipkart
  > 3. SBI SimplyClick — LTF, 10× online rewards
  >
  > All three use the same eligibility record from your loan app. 2-minute apply. Bank issues card in 5 days.
- CTA: Pick one
- Why: Email for the thoughtful re-engagement. Emphasises zero-friction path.

**M5 · Day 30 · 10:00 AM · push · (no hook tag)**
- Title: Still looking? Loan OR card — your call
- Body: Both products. Same app. Same pre-approved eligibility. No pressure.
- CTA: See both
- Why: Low-pressure final close. Respects their timeline.

---

### Cohort 6 — Rejected, Fibe FD holder
- **Persona**: Rejected on loan. Has FD = liquidity exists. Honest FD-card path.
- **Cap**: 6 messages — "your FD earned this".

**M1 · Day 1 · 11:00 AM · push · H7**
- Title: Your FD is working harder than you think
- Body: You have ₹50,000 in Fibe FD. Unlock a credit card against it — FD keeps earning, card gives credit.
- CTA: See FD-backed cards
- Why: FD = already-earned trust signal. Reframe from "rejected" to "unlocked."

**M2 · Day 3 · 10:00 AM · push · H7**
- Title: ₹50K FD = ₹50K credit line · zero joining fee
- Body: FIRST EARN or Axis Insta — 1:1 credit against your FD. Approval guaranteed.
- CTA: Apply
- Why: Name the cards. Make the math 1:1 explicit.

**M3 · Day 5 · 8:00 PM · push · H7**
- Title: Your FD keeps earning 7.5% — card is on top
- Body: You don't break the FD. You don't lose interest. You just get a credit line alongside.
- CTA: See how it works
- Why: Answers the biggest objection — "will I lose FD returns?" No.

**M4 · Day 7 · 8:00 PM · email · H7**
- Subject: Your Fibe FD just became a credit card
- Preheader: Same FD. Same returns. Plus a credit line.
- Body:
  > Your ₹50,000 Fibe FD is eligible for these 3 FD-backed cards:
  >
  > 1. FIRST EARN — 1:1 credit, 10% LTV optional top-up, zero joining fee
  > 2. Axis Insta Easy — 100% credit against FD, 10× rewards on dining
  > 3. SBI Unnati — ₹0 annual fee for 4 years, 4% cashback on Amazon
  >
  > All three approve within 24 hours — your FD is pre-verified.
  >
  > Your FD continues earning 7.5% p.a. throughout. The card is in addition, not instead.
  >
  > Month-over-month data: users who start here see their credit score rise 40–80 points in 6 months. That opens unsecured cards and Fibe loan eligibility.
- CTA: Pick 1 of 3
- Why: FD-holders are liquidity-rich, trust-scarred. Email unpacks the full mechanic + downstream payoff.

**M5 · Day 14 · 11:00 AM · push · H7**
- Title: Approval ready · secured card can issue today
- Body: Your FD-backed application is pre-approved. Bank can issue card within 24 hours.
- CTA: Complete · 1 min
- Why: Urgency framing. Low-pressure because approval is real.

**M6 · Day 21 · 10:00 AM · push · H7**
- Title: FD card users: credit score +40–80 in 6 months
- Body: Data from 10K Fibe FD-backed card users. That's the gap to unsecured eligibility.
- CTA: Start the ladder
- Why: Data-as-evidence for the long-term unlock.

---

### Cohort 7 — Rejected, salvageable (low score, no FD)
- **Persona**: Rejected on loan. Credit score at 640. Target: 720. No FD liquidity. Empathetic + builder narrative.
- **Cap**: 6 messages · credit-builder narrative only.

**M1 · Day 1 · 11:00 AM · push · H7**
- Title: Let's get you approved next time
- Body: Three steps + one FIRST EARN card = Fibe loan eligible in 6 months. Here's the playbook.
- CTA: See the 6-month plan
- Why: Never "rejected." Reframe as "next time." Plan language gives agency.

**M2 · Day 3 · 10:00 AM · push · H7**
- Title: Your score: 640 · target: 720 · gap: 80 points
- Body: Most users close this gap in 4–6 months with a secured card + on-time payments.
- CTA: See the playbook
- Why: Hardcoded bucket + target. Specific > abstract. Math beats narrative.

**M3 · Day 7 · 8:00 PM · email · H7**
- Subject: The reason we said no — and the fix.
- Preheader: 640 today. 720 target. Here's the 6-month path.
- Body:
  > We weren't able to approve your loan last week. Here's why, in plain language, and what you can do:
  >
  > Your credit score sits at 640. Fibe's loan threshold is 720. The gap is 80 points — fixable in 4–6 months.
  >
  > The playbook:
  >
  >   1. Open a FIRST EARN secured card — ₹10,000 FD, ₹10,000 credit line.
  >   2. Use it for 3 regular payments a month — OTT, mobile recharge, grocery.
  >   3. Pay the bill in full, 3 days before the due date. Every month.
  >
  > After 4–6 months of this, your score clears the Fibe loan threshold. 10K Fibe users have crossed it this way — average jump 47 points, median 56.
  >
  > This isn't a sales pitch. It's the exact 6-month plan we'd tell our own family.
  >
  > You pick when to start. If never, no follow-up.
- CTA: Start the plan — ₹10K FD
- Why: Variables HARDCODED: score 640, target 720, gap 80. Specific FIRST EARN card. Specific behaviour steps.

**M4 · Day 14 · 9:00 AM · push · H7**
- Title: Month 1 of your score plan
- Body: You haven't started yet. The sooner you begin, the sooner you're loan-eligible.
- CTA: Start today
- Why: Gentle reactivation. No pressure, just math on time.

**M5 · Day 21 · 11:00 AM · push · H7**
- Title: FIRST EARN — 24hr approval · ₹10K FD
- Body: Lowest-friction secured card in the Fibe app. FD earns 7.5% while it works.
- CTA: Apply
- Why: Name the card + the approval speed. Remove friction objection.

**M6 · Day 30 · 10:00 AM · push · H7**
- Title: Check-in: how's month 1 going?
- Body: Start today, we check in again month 3. If score up, we show unsecured options.
- CTA: Keep going
- Why: Quarterly touch = relationship, not sales.

---

### Cohort 8 — Rejected, unsalvageable
- **Persona**: Pincode not served (400088). Bank will also reject. No credit-score-lift path.
- **Cap**: 1 email · don't burn the relationship.

**M1 · Day 1 · 9:00 AM · email · (no hook tag)**
- Subject: We couldn't approve you — here's honest feedback.
- Preheader: One message. Specific reason. No spam.
- Body:
  > We couldn't approve your application this time.
  >
  > The reason: we don't yet serve the 400088 pincode — our partner-bank coverage area doesn't include it.
  >
  > We're not going to pretend another lender will have different answers. They almost certainly won't, because the bank-side pincode restriction is shared across most digital lenders in India.
  >
  > What we can do:
  >
  >   → If your pincode changes (new residence, office relocation), reapply. No fee, no wait period.
  >   → Your free credit score is always available on Fibe. Check it any time.
  >   → We won't keep pinging you with offers. You'll hear from us only if something specific to your pincode opens up.
  >
  > This is our only message. No Day 7, no Day 30, no "last chance."
  >
  > If circumstances change, we're here.
- CTA: (none)
- Why: Variable hardcoded: pincode 400088. Reason is specific. Most fintechs sell anyway — we don't. Brand equity play.

---

### Cohort 9 — Credit-widget users (score viewed, no action)
- **Persona**: Score widget viewed. Dormant top-of-funnel. Triggered on bucket changes.
- **Cap**: 8 messages across year, fired on score-bucket changes.

**M1 · Day 1 · on 650→750 shift · push · H4**
- Title: Your score just unlocked 3 new cards
- Body: 750+ = HDFC Regalia Gold, SBI Elite, Amex MRCC are now within reach. Pre-eligibility checked.
- CTA: See the 3
- Why: H4 Score unlock. Real-time trigger, zero-spam feel.

**M2 · Day 1 · on 650→750 shift · push · H4**
- Title: 750 is the band where you save ₹20K+/yr on a card
- Body: Premium cashback tier opens up here. 3-card shortlist inside.
- CTA: See savings
- Why: Follow-up to bucket-change alert — adds savings math.

**M3 · Day 1 · on 750→800 shift · push · H4**
- Title: You're in premium territory
- Body: Cards people at 800+ actually use: HDFC Infinia, Axis Magnus, Amex Platinum. 3-pick.
- CTA: See the 3
- Why: 800+ is the super-prime unlock. Aspirational tier, matched cards.

**M4 · Day 7 · 6:00 PM · push · H5**
- Title: Your credit score at 750 = ₹12,000 cashback/yr missed
- Body: Most users at your band apply within 30 days of checking. You haven't. Here's the card.
- CTA: See HDFC Regalia
- Why: Loss-framing. Most effective on prime-band dormant users.

**M5 · Day 14 · 8:00 PM · email · H4**
- Subject: Score ↑ means new cards unlocked · here's your shortlist
- Preheader: Bucket change = pre-eligibility reset. Apply now.
- Body:
  > Every time your credit score crosses a band, a new set of cards becomes eligible for you — with better rewards, higher credit limits, lower fees.
  >
  > Your current band (750–799) unlocks:
  >
  > 1. HDFC Regalia Gold — 4× rewards on dining + travel
  > 2. SBI Elite — 5× on flights, complimentary lounge access
  > 3. Amex MRCC — 18× rewards on spending categories you pick
  >
  > All three skip the "new-to-credit" tier. Full-benefit eligibility from day 1.
  >
  > This offer resets when your band changes again.
- CTA: See all 3
- Why: Expand score-unlock into full catalog. Email = room for all 3 cards + mechanic.

**M6 · Day 30 · 11:00 AM · push · H5**
- Title: Monthly score digest · 1 card matched
- Body: Your score held at 752. This month's top-match: SBI Elite — 5× on flights.
- CTA: See card
- Why: Monthly ritual builds stickiness. Always one concrete card.

**M7 · Day 60 · 10:00 AM · push · H3**
- Title: Still at 750 — still eligible for 3 premium cards
- Body: You've seen these before. Nothing has changed. 2-minute apply.
- CTA: See the 3
- Why: Low-key re-reminder. Same cards, same eligibility.

**M8 · Day 90 · 9:00 AM · push · H5**
- Title: Your score vs your spend: ₹22,400/yr on the table
- Body: Based on your score + average spend, an HDFC Regalia saves you ₹22K/yr vs no card.
- CTA: See the math
- Why: Quarterly touch. Fresh angle — spend-vs-score math.

---

## Hooks

All hooks carry per-card economics: `cost` (what GC pays out per approved card), `envelope` (commission available net of cost), `baseline` vs `lift` (pp CTR expected vs observed on surface). `phase1: true` = part of the pilot stack shipping first.

### H1 — EMI on us · *₹1,500 EMI reimbursement* · PHASE 1
- **Promise**: Take this card, swipe ₹10K+ in 30 days. We pay your next loan EMI — up to ₹1,500.
- **Cohort**: Approved + loan taken (≤90d)
- **Surface**: banner
- **Cost**: ₹1,050/card · **Envelope**: ₹950
- **Baseline → Lift**: 5 → 13 (pp)
- **Phone preview**:
  - Title: ₹1,50,000 credited ✓
  - Body: Swipe ₹10K on this card in 30 days — we pay your next EMI. Up to ₹1,500.
  - CTA: Claim the card

### H2 — Play & Win · *Gamified LTF unlock*
- **Promise**: Play Slash-the-Fruits with 500 FibeCoins. Win 3 in a row → joining fee waived forever on the card of your choice.
- **Cohort**: Rewards-engaged (Media 3 players)
- **Surface**: game
- **Cost**: ₹400/card · **Envelope**: ₹1,600
- **Baseline → Lift**: 1.5 → 5 (pp)
- **Phone preview**:
  - Title: You won! 🎉
  - Body: 3 wins in a row — pick your free card
  - CTA: Claim my card

### H3 — LTF + ₹500 · *Zero fee + ₹500 bonus* · PHASE 1
- **Promise**: Zero joining fee. Zero annual fee. ₹500 cashback on first ₹1,000 spend.
- **Cohort**: Registered + PAN, no loan
- **Surface**: card
- **Cost**: ₹0/card — FREE, merchandising only · **Envelope**: ₹2,000
- **Baseline → Lift**: 2 → 6 (pp)
- **Phone preview**:
  - Title: Lifetime free · ₹500 back
  - Body: Axis Ace Credit Card — no joining, no annual fee. Spend ₹1,000, get ₹500 back.
  - CTA: Apply — 2 min

### H4 — Score unlock · *750+ reveals 3 new cards* · PHASE 1
- **Promise**: Score crossed 750? Three new premium cards are now within reach. Pre-eligibility checked.
- **Cohort**: Credit-widget users at bucket change
- **Surface**: score
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 0.5 → 3.5 (pp)
- **Phone preview**:
  - Title: Your score: 752 🎉
  - Body: +18 since last check. 3 new premium cards just unlocked.
  - CTA: See the 3

### H5 — Personalised · *Specific savings math*
- **Promise**: Based on your last 6 EMIs and spend pattern, this card saves you ₹38,000 over 12 months.
- **Cohort**: Active borrower, ≥3 EMIs paid (Phase 3)
- **Surface**: personalised
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 3 → 8.5 (pp)
- **Phone preview**:
  - Title: Matched to your spend
  - Body: HDFC Millennia — Save ₹38,000/yr based on your last 6 months of Fibe data.
  - CTA: See the math

### H6 — Card + loan combo · *Waive both fees*
- **Promise**: Take any loan + this card together. Loan processing fee waived AND ₹750 off joining fee. Combo-only.
- **Cohort**: Approved-not-yet-disbursed loan
- **Surface**: combo
- **Cost**: ₹500/card · **Envelope**: ₹1,500
- **Baseline → Lift**: 5 → 12 (pp)
- **Phone preview**:
  - Title: Add a card?
  - Body: Bundle saves you ₹1,249 in fees. One checkout, both products.
  - CTA: Add to loan

### H7 — FD → unsecured ladder · *6-month path to unsecured*
- **Promise**: Start with a FD-backed card. 6 on-time payments → HDFC Millennia unsecured. We handle the upgrade.
- **Cohort**: Rejected-low-score with ₹10K liquidity
- **Surface**: ladder
- **Cost**: ₹0/card — FREE · **Envelope**: ₹4,000
- **Baseline → Lift**: 0.5 → 2 (pp)
- **Phone preview**:
  - Title: Your 6-month path
  - Body: Month 0–6: FIRST EARN secured card. Month 7: HDFC Millennia unsecured. Automatic.
  - CTA: Start month 0

### H8 — Referral · *₹1,000 per approved card*
- **Promise**: Refer 3 friends who get a card. ₹1,000 per approved card. ₹3,000 on 3.
- **Cohort**: Any user with a card via Fibe
- **Surface**: referral
- **Cost**: ₹1,000/card · **Envelope**: ₹1,000
- **Baseline → Lift**: 1 → 5 (pp)
- **Phone preview**:
  - Title: Your referral code
  - Body: ABHI300 · Share with 3 friends. ₹1,000 per card they get approved.
  - CTA: Share on WhatsApp

### H9 — Salary match · *Peer-tier card reco*
- **Promise**: Your salary crossed ₹1L. You're in premium territory. Take the card salaried-people-at-your-level actually use.
- **Cohort**: B2B wellness users at salary threshold
- **Surface**: tier
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 3 → 7 (pp)
- **Phone preview**:
  - Title: You're now in premium
  - Body: HDFC Regalia Gold — what peers at ₹1L+ use. 4× rewards on dining, travel.
  - CTA: See the card

### H10 — 0% EMI · *Financing you already do*
- **Promise**: Take this card, get 0% EMI on 10K+ partner merchants — phones, electronics, insurance, education.
- **Cohort**: EMI-mindset users
- **Surface**: emi
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 4 → 9 (pp)
- **Phone preview**:
  - Title: 0% EMI on everything
  - Body: 10K+ partner merchants. Already financing? Shift it to this card, pay 0 interest.
  - CTA: See card

### H11 — 1L points · *Premium signup bonus*
- **Promise**: Take this card, spend ₹50K in 30 days, get 1 lakh reward points. Worth ₹25,000.
- **Cohort**: High-income (≥₹1L/mo) disbursed-loan
- **Surface**: premium
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 5 → 15 (pp)
- **Phone preview**:
  - Title: 1,00,000 points in month 1
  - Body: Spend ₹50K, get ₹25K in flights/hotels/gift cards. HDFC Regalia signup bonus.
  - CTA: Apply

### H12 — Rewards pay EMI · *Math-first framing*
- **Promise**: Use this card for 3 months. The rewards pay your 4th EMI. ₹40K × 2% × 3 = ₹2,400.
- **Cohort**: Approved-loan-active, spend ≥₹30K
- **Surface**: math
- **Cost**: ₹0/card — FREE · **Envelope**: ₹2,000
- **Baseline → Lift**: 5 → 9 (pp)
- **Phone preview**:
  - Title: Rewards = 1 free EMI
  - Body: ₹40K/mo × 2% × 3 months = ₹2,400. Your 4th EMI paid by card rewards.
  - CTA: See the math

---

## Hook → Cohort appearance matrix

Hooks are tagged on messages via `hook: 'H<id>'`. Current wiring:

| Hook | Appears in cohorts |
| --- | --- |
| H1 EMI on us | 4 |
| H2 Play & Win | (reserve — not wired into an arc yet) |
| H3 LTF + ₹500 | 1, 2, 5, 9 |
| H4 Score unlock | 1, 9 |
| H5 Personalised | 1, 2, 5, 9 |
| H6 Card + loan combo | 4 |
| H7 FD → unsecured ladder | 6, 7 |
| H8 Referral | (reserve — not wired into an arc yet) |
| H9 Salary match | 1 |
| H10 0% EMI | 2, 4 |
| H11 1L points | 2, 4, 5 |
| H12 Rewards pay EMI | 4 |

Cohort 3 (loan-pending) and Cohort 8 (unsalvageable) are intentionally outside the hook rotation.

---

## Review checklist for a fresh-view pass

1. **Hook discipline** — does every message earn its `H<id>` tag? Strip tags where the body doesn't actually deliver the hook's promise.
2. **Named cards vs categories** — every push should name at least one card, not a generic "lifetime free card." Flag anything that drifts abstract.
3. **Math credibility** — ₹ figures are illustrative, not contractual. Confirm each math block is plausible (categories × rate × cap) before it ships.
4. **Silent-cohort fences** — C3 and C8 messaging must stay at zero / one respectively. Any addition breaks the brand promise.
5. **PII leakage** — bodies currently use pseudo-names (Aarav), pincode (400088), score bucket (640/720/752). Confirm these stay bucket-ish or placeholder; no raw user IDs or phone numbers.
6. **CTA verb** — every push CTA must be a single action. "See/Apply/Claim/Pick" — no "Let us help you consider."
7. **Cadence** — C1 is 11 messages in 30 days. Flag if that feels heavy; we can trim Day-1 double push or Day 22 email.
