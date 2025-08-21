require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config();
const { OpenAI } = require("openai"); // Correct import for v5

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// OpenAI setup (v5)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// JWT middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "SECRET_KEY", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  category: String,
  completed: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

// Routes

// Register
app.post("/api/users/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY");
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id }, "SECRET_KEY");
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Login failed", error: err.message });
  }
});

// Create task
app.post("/api/tasks", authMiddleware, async (req, res) => {
  const { title, category } = req.body;
  try {
    const task = new Task({ userId: req.user.id, title, category });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
});

// Get tasks
app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch tasks", error: err.message });
  }
});

// Update task
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  const { title, category, completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (title) task.title = title;
    if (category) task.category = category;
    if (typeof completed === "boolean") task.completed = completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task", error: err.message });
  }
});

// Delete task
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete task", error: err.message });
  }
});

// Chatbot AI endpoint
app.post("/api/chat", authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "No message provided" });
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "Failed to get AI response", error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
