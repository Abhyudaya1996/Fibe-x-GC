# Fibe × Great.Cards — Integration Demo

A functional mock of the Fibe app demonstrating how Great.Cards credit card recommendations appear at 5 nudge points in the Fibe user journey. All card data is fetched live from the Great.Cards Partner API.

## Prerequisites

- Node.js 18+ (check: `node -v`)
- npm 9+ (check: `npm -v`)

## Setup

### 1. Clone / download the project

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your API key:

```
PARTNER_API_KEY=your_api_key_here
BASE_URL=test-partner.bankkaro.com
```

> **Never commit `.env` to source control.** The `.env.example` file is safe to commit.

### 3. Install & run

```bash
npm install && npm run dev
```

Open **http://localhost:3000** in your browser.

---

## The 5 Screens

| Tab | Nudge Point | API Chain | Max Cards |
|-----|-------------|-----------|-----------|
| Home | Homepage Widget | `/calculate` (with spend) or `/cards` (cold start) | 3 |
| Rejection | Loan Declined | `/cards` with `free_cards:true, credit_score:600` | 1 |
| Thank You | Post Disbursal | `/calculate` → `/eligiblity` | 2 |
| Repayment | EMI Tracker | `/cards` with `free_cards:true, sort_by:annual_savings` | 2 |
| Email | Sanctioned Email | `/calculate` (Travel default) | 2 |

---

## Demo Controls

A collapsible panel at the top of the page lets you change:

- **Credit Score** — slider that snaps to valid API buckets (600 / 650 / 750 / 800)
- **Monthly Income** — numeric input, default 65,000
- **Employment Type** — toggle between Salaried / Self-Employed
- **Pincode** — 6-digit input, default 400001

Changing any control marks all screens as stale and reloads the active screen immediately.

---

## Project Structure

```
fibe-gc-demo/
├── .env.example        # Environment template
├── .env                # Your secrets (not committed)
├── DECISIONS.md        # Tech stack rationale
├── README.md           # This file
├── package.json
├── server.js           # Express backend + API proxy
└── public/
    ├── index.html      # Single-page app shell
    ├── styles.css      # All styles (Fibe-branded)
    └── app.js          # All frontend logic
```

---

## API Notes

- **Auth**: `POST /token` is called on server startup and token is cached for 23 hours.
- **Init bundle**: `GET /cardgenius/init-bundle` is called once on startup and cached.
- **Slow UAT**: Responses can take up to 30 seconds. Loading spinners are shown on every screen. Do not use UAT timing to judge production performance.
- **No PII in URLs**: Redirect URLs use bucketed credit score and rounded income only (per PRD Section 4.6).

## Switching to PROD

Update `.env`:

```
BASE_URL=platform.bankkaro.com
PARTNER_API_KEY=your_prod_key
```

Restart the server. No code changes needed.
