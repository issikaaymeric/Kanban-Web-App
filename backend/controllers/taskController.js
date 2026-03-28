const TaskModel = require('../models/taskModel');

const taskController = {
  // GET /api/tasks  or  GET /api/tasks?columnId=1
  async getAllTasks(req, res) {
    try {
      const { columnId } = req.query;
      const tasks = await TaskModel.getAll(columnId || null);
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/tasks/:id
  async getTaskById(req, res) {
    try {
      const task = await TaskModel.getById(req.params.id);
      if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/tasks
  async createTask(req, res) {
    try {
      const { title, content, column_id, position } = req.body;

      if (!title || !column_id) {
        return res.status(400).json({
          success: false,
          error: 'title and column_id are required',
        });
      }

      const task = await TaskModel.create({ title, content, column_id, position });
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // PATCH /api/tasks/:id
  async updateTask(req, res) {
    try {
      const { title, content } = req.body;
      const task = await TaskModel.update(req.params.id, { title, content });
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // PATCH /api/tasks/:id/move  — used for drag & drop
  async moveTask(req, res) {
    try {
      const { column_id, position } = req.body;

      if (column_id === undefined || position === undefined) {
        return res.status(400).json({
          success: false,
          error: 'column_id and position are required',
        });
      }

      const task = await TaskModel.move(req.params.id, column_id, position);
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // DELETE /api/tasks/:id
  async deleteTask(req, res) {
    try {
      const result = await TaskModel.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = taskController;
