const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Standard CRUD
router.get('/',        taskController.getAllTasks);
router.get('/:id',     taskController.getTaskById);
router.post('/',       taskController.createTask);
router.patch('/:id',   taskController.updateTask);
router.delete('/:id',  taskController.deleteTask);

// Special route for drag & drop moves
router.patch('/:id/move', taskController.moveTask);

module.exports = router;
