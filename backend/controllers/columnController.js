const ColumnModel = require('../models/columnModel');

const columnController = {
  // GET /api/columns  — returns all columns with their tasks nested inside
  async getAllColumns(req, res) {
    try {
      const columns = await ColumnModel.getAll();
      res.json({ success: true, data: columns });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/columns/:id
  async getColumnById(req, res) {
    try {
      const column = await ColumnModel.getById(req.params.id);
      if (!column) return res.status(404).json({ success: false, error: 'Column not found' });
      res.json({ success: true, data: column });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/columns
  async createColumn(req, res) {
    try {
      const { title, position } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, error: 'title is required' });
      }
      const column = await ColumnModel.create({ title, position });
      res.status(201).json({ success: true, data: column });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // PATCH /api/columns/:id
  async updateColumn(req, res) {
    try {
      const { title } = req.body;
      const column = await ColumnModel.update(req.params.id, { title });
      res.json({ success: true, data: column });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // DELETE /api/columns/:id
  async deleteColumn(req, res) {
    try {
      const result = await ColumnModel.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = columnController;
