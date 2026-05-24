const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes        = require('./routes/authRoutes');
const userRoutes        = require('./routes/userRoutes');
const scanRoutes        = require('./routes/scanRoutes');
const rewardRoutes      = require('./routes/rewardRoutes');
const recyclerRoutes    = require('./routes/recyclerRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const errorHandler      = require('./middleware/errorHandler');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

// ── Request logger (dev) ──────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ── Health check ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: '✅ EcoScan Backend Running', timestamp: new Date() });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/scans',       scanRoutes);
app.use('/api/rewards',     rewardRoutes);
app.use('/api/recyclers',   recyclerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin',       adminRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start server FIRST, then connect DB ──────────────────────
// This ensures the server is always reachable even if DB is slow
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log('⏳ Connecting to MongoDB...');
});

// Connect DB after server starts (non-blocking)
connectDB().then(() => {
  console.log('✅ MongoDB connected — all routes fully operational');
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('   Check your MONGO_URI in .env and ensure your IP is whitelisted in MongoDB Atlas.');
});
