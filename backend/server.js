const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./tasks.json";

// Read tasks from file
function readTasks() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// Write tasks to file
function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    status: "Pending"
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

// Mark task as completed
app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const taskId = parseInt(req.params.id);

  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, status: "Completed" } : task
  );

  writeTasks(tasks);
  res.json({ message: "Task updated" });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const taskId = parseInt(req.params.id);

  tasks = tasks.filter(task => task.id !== taskId);
  writeTasks(tasks);

  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
