const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single task by ID
router.get('/:id', getTask, (req, res) => {
  res.json(res.task);
});

// CREATE a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    completed: req.body.completed,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a task by ID
router.patch('/:id', getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.completed != null) {
    res.task.completed = req.body.completed;
  }

  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task by ID
router.delete('/:id', getTask, async (req, res) => {
  try {
    await Task.deleteOne({ _id: res.task._id });
    console.log(`Deleted task with ID ${req.params.id}`);
    res.json({ message: 'Deleted Task' });
  } catch (err) {
    console.error(`Error deleting task with ID ${req.params.id}:`, err.message);
    res.status(500).json({ message: err.message });
  }
});


// Middleware function to get task by ID
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      console.error(`Task with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Cannot find task' });
    }
  } catch (err) {
    console.error(`Error fetching task with ID ${req.params.id}:`, err.message);
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}

module.exports = router;
