require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = `https://${process.env.BASE_URL}/partner`;
const API_KEY  = process.env.PARTNER_API_KEY;
const TIMEOUT  = 40000; // 40s — UAT can be up to 30s per API guide

if (!API_KEY) {
  console.error('\n❌  PARTNER_API_KEY is not set. Copy .env.example → .env and add your key.\n');
  process.exit(1);
}

// ─── Token & bundle cache ─────────────────────────────────────────────────────

let _token       = null;
let _tokenExpiry = 0;
let _initBundle  = null;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;

  console.log('[Auth] Fetching partner token...');
  const res = await axios.post(
    `${BASE_URL}/token`,
    { 'x-api-key': API_KEY },
    { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
  );

  // Postman test script shows: responseJson.data.jwttoken
  const jwt =
    res.data?.data?.jwttoken ||
    res.data?.jwttoken       ||
    res.data?.token          ||
    res.data?.access_token;

  if (!jwt) {
    throw new Error('Token response missing jwttoken. Raw: ' + JSON.stringify(res.data).slice(0, 300));
  }

  _token       = jwt;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 h
  console.log('[Auth] Token acquired ✓');
  return _token;
}

async function getInitBundle() {
  if (_initBundle) return _initBundle;

  const token = await getToken();
  console.log('[Init] Fetching init bundle...');
  const res = await axios.get(`${BASE_URL}/cardgenius/init-bundle`, {
    headers: { 'partner-token': token },
    timeout: 30000,
  });
  _initBundle = res.data;
  console.log('[Init] Bundle cached ✓');
  return _initBundle;
}

// ─── Shared axios headers ─────────────────────────────────────────────────────

function headers(token) {
  return {
    'partner-token': token,
    'Content-Type':  'application/json',
    // Mirror the User-Agent from the Postman collection
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  };
}

// ─── Error wrapper ────────────────────────────────────────────────────────────

function handle(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      const status  = err.response?.status  || 500;
      const data    = err.response?.data;
      const message = data?.message || err.message || 'Unknown error';
      console.error(`[API Error] ${req.path} → ${status}`, JSON.stringify(data || message).slice(0, 500));
      res.status(status).json({ ok: false, error: message, fallback: true });
    }
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health / ready check for the frontend
app.get('/api/status', handle(async (_req, res) => {
  await getToken();
  res.json({ ok: true, status: 'ready', base: BASE_URL });
}));

// Init bundle (cached)
app.get('/api/init', handle(async (_req, res) => {
  const data = await getInitBundle();
  res.json({ ok: true, data });
}));

// POST /cardgenius/cards  — filtered card list
app.post('/api/cards', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/cards`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// GET /cardgenius/cards/:alias — card detail
app.get('/api/cards/:alias', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.get(
    `${BASE_URL}/cardgenius/cards/${encodeURIComponent(req.params.alias)}`,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// POST /cardgenius/calculate — multi-category spend optimiser
app.post('/api/calculate', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/calculate`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// POST /cardgenius/eligiblity — NOTE: API endpoint has a typo (missing 'i')
app.post('/api/eligibility', handle(async (req, res) => {
  const token = await getToken();
  const upstream = await axios.post(
    `${BASE_URL}/cardgenius/eligiblity`,
    req.body,
    { headers: headers(token), timeout: TIMEOUT }
  );
  res.json({ ok: true, data: upstream.data });
}));

// GET /api/city/:pincode — resolve Indian pincode → city name via India Post
app.get('/api/city/:pincode', handle(async (req, res) => {
  const { pincode } = req.params;
  if (!/^\d{6}$/.test(pincode)) return res.status(400).json({ ok: false, error: 'Invalid pincode' });

  const upstream = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, { timeout: 8000 });
  const result   = upstream.data?.[0];

  if (!result || result.Status !== 'Success' || !result.PostOffice?.length) {
    return res.json({ ok: false, error: 'Pincode not found' });
  }

  const po       = result.PostOffice[0];
  const city     = po.District || po.Division || po.Name || '';
  const state_   = po.State || '';

  res.json({ ok: true, city, state: state_, pincode });
}));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, async () => {
  console.log(`\n🟠  Fibe × Great.Cards Demo`);
  console.log(`    http://localhost:${PORT}\n`);
  console.log(`    API base: ${BASE_URL}`);

  // Warm up token + bundle in the background so first screen load is faster
  try {
    await getToken();
    await getInitBundle();
    console.log('\n✓  API warmed up and ready\n');
  } catch (err) {
    console.warn('\n⚠   Startup warm-up failed:', err.message);
    console.warn('    API calls will still be attempted on demand.\n');
  }
});
