
const express = require("express");
const Task = require("../models/taskModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get tasks
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json(tasks);
});

// Create task
router.post("/", protect, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const task = await Task.create({ title, user: req.user._id });
  return res.status(201).json(task);
});

// Update task
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

  task.title = req.body.title ?? task.title;
  if (typeof req.body.completed === "boolean") task.completed = req.body.completed;
  const updatedTask = await task.save();
  return res.json(updatedTask);
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

  await task.deleteOne();
  return res.json({ message: "Task deleted" });
});

module.exports = router;
