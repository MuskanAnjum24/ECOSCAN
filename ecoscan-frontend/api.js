// ============================================================
//  api.js — EcoScan Frontend ↔ Backend Bridge
//  Include this on EVERY page:  <script src="api.js"></script>
// ============================================================

// Change this if your backend runs on a different port or host
const API_BASE = (window.ECOSCAN_API_BASE || 'http://localhost:5000') + '/api';

// ── Token / user helpers ──────────────────────────────────────
function getToken()      { return localStorage.getItem('ecoscan_token'); }
function setToken(t)     { localStorage.setItem('ecoscan_token', t); }
function removeToken()   { localStorage.removeItem('ecoscan_token'); localStorage.removeItem('ecoscan_user_data'); }
function getUserData()   { try { return JSON.parse(localStorage.getItem('ecoscan_user_data')); } catch { return null; } }
function setUserData(u)  { localStorage.setItem('ecoscan_user_data', JSON.stringify(u)); }
function isLoggedIn()    { return !!getToken(); }

// ── Core fetch wrapper ────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token   = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res, data;
  try {
    // 8-second timeout so the page never hangs forever
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 8000);
    res  = await fetch(`${API_BASE}${endpoint}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    data = await res.json();
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') {
      throw new Error('Server is taking too long to respond. Make sure the backend is running: cd ecoscan-backend && node server.js');
    }
    throw new Error('Cannot reach the server. Make sure the backend is running: cd ecoscan-backend && node server.js');
  }

  if (!res.ok) {
    throw new Error(data.message || `Server error ${res.status}`);
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
  async signup({ firstName, lastName, email, password }) {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    setToken(data.token);
    setUserData(data.user);
    return data;
  },

  async login({ email, password }) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUserData(data.user);
    return data;
  },

  logout() {
    removeToken();
    window.location.href = 'login.html';
  },

  async getMe() {
    const data = await apiFetch('/auth/me');
    setUserData(data);
    return data;
  },
};

// ── Scans ─────────────────────────────────────────────────────
const Scans = {
  save(payload)    { return apiFetch('/scans', { method: 'POST', body: JSON.stringify(payload) }); },
  history()        { return apiFetch('/scans'); },
  getById(id)      { return apiFetch(`/scans/${id}`); },
  markRecycled(id) { return apiFetch(`/scans/${id}/recycle`, { method: 'PATCH' }); },
};

// ── Rewards ───────────────────────────────────────────────────
const Rewards = {
  list()            { return apiFetch('/rewards'); },
  summary()         { return apiFetch('/rewards/summary'); },
  redeem(pts, desc) {
    return apiFetch('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ points: pts, description: desc }),
    });
  },
};

// ── Users ─────────────────────────────────────────────────────
const Users = {
  getProfile()      { return apiFetch('/users/profile'); },
  updateProfile(d)  { return apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(d) }); },
  stats()           { return apiFetch('/users/stats'); },
  changePassword(current, next) {
    return apiFetch('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
  },
};

// ── Leaderboard ───────────────────────────────────────────────
const Leaderboard = {
  global()     { return apiFetch('/leaderboard'); },
  byCity(city) { return apiFetch(`/leaderboard/city?city=${encodeURIComponent(city)}`); },
};

// ── Recyclers ─────────────────────────────────────────────────
const Recyclers = {
  all()        { return apiFetch('/recyclers'); },
  nearby(city) { return apiFetch(`/recyclers/nearby?city=${encodeURIComponent(city)}`); },
  getById(id)  { return apiFetch(`/recyclers/${id}`); },
};

// ── Auth guard — call on every protected page ─────────────────
function requireLogin(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// ── Logout helper ─────────────────────────────────────────────
function ecoscanLogout() { Auth.logout(); }

// ── Auto-populate nav user info ───────────────────────────────
async function initNavUser() {
  if (!isLoggedIn()) return;
  try {
    const user = getUserData() || await Auth.getMe();
    document.querySelectorAll('.nav-username, #navUsername').forEach(el => {
      el.textContent = user.firstName || user.email;
    });
    document.querySelectorAll('.nav-points, #navPoints').forEach(el => {
      el.textContent = `${user.points} pts`;
    });
  } catch (_) { /* silent */ }
}

document.addEventListener('DOMContentLoaded', initNavUser);
