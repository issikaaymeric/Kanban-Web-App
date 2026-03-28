require('dotenv').config();
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const columnRoutes = require('./routes/columnRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── CORS ───────────────────────────────────────────────────
// Allow the origins listed in CLIENT_URL (comma-separated) plus localhost for dev.
// On Vercel, set CLIENT_URL=https://your-frontend.vercel.app in environment variables.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(o => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Kanban API is running' });
});

app.use('/api/tasks',   taskRoutes);
app.use('/api/columns', columnRoutes);

// ── Error handling (must be after routes) ──────────────────
app.use(notFound);
app.use(errorHandler);

// ── Local dev server (Vercel handles its own listening) ────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\u2713 Kanban API running at http://localhost:${PORT}`);
  });
}

// Vercel needs the app exported
module.exports = app;
