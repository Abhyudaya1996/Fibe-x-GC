# Tech Stack Decisions

## Stack Choice: Node.js + Express + Vanilla JS

### Backend: Node.js + Express
- **Why not Next.js / Vite / React**: This is a demo with a hard requirement of real API calls proxied server-side. Adding a frontend framework would introduce a build step and unnecessary complexity for a single-session demo.
- **Why Express**: Zero-config, ships immediately, ideal for an API proxy layer. Single `node server.js` starts everything.
- **Deps kept minimal**: `express`, `axios`, `dotenv` only. No ORM, no session store, no build toolchain.

### Frontend: Vanilla HTML + CSS + JS
- **Why not React/Vue**: The demo has 5 static screens that swap in and out. No component tree needed. Vanilla JS `innerHTML` + DOM manipulation is faster to write and has zero build time.
- **Why no bundler**: Direct `<script src="app.js">` means the reviewer can inspect the source without source maps. Also means the demo runs correctly even if npm build step is skipped.
- **Single `app.js`**: All screen logic, card rendering, API calls, and state in one file. Easier to demo and debug in devtools.

### Serving: Express static middleware
- Frontend files served from `public/` by the same Express process.
- No CORS issues since frontend and API are on the same origin/port.
- Single command: `npm run dev` starts everything.

### Why NOT alternatives
| Alternative | Rejected because |
|---|---|
| Next.js | Overkill for a demo; server components add complexity without benefit |
| Vite + React | Build step required; harder to run for a non-frontend reviewer |
| Python/Flask | Team likely more familiar with JS; one language throughout |
| Serverless/Vercel | Requires deployment; `localhost` demo is faster to review |

### API Proxy Design
- All Great.Cards API calls go through Express routes at `/api/*`
- Partner token cached in-memory, auto-refreshed when expired
- Init bundle cached on startup, warmed immediately
- 40s timeout on all upstream calls (UAT can be slow per API guide)
- `eligiblityPayload` typo preserved to match actual API endpoint

### Known API Constraints Handled
1. `cardGeniusPayload` = single-tag only → homepage multi-category uses `/calculate` exclusively
2. `credit_score` → snaps to 600/650/750/800 buckets before any API call
3. `/cardgenius/eligiblity` endpoint has a typo (missing 'i') → preserved exactly
4. UAT latency up to 30s → loading states on every screen, 40s axios timeout
