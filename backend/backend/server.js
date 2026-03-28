require('dotenv').config();
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const columnRoutes = require('./routes/columnRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Kanban API running at http://localhost:${PORT}`);
});

module.exports = app;
