const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const dataDirectory = path.join(__dirname, '../data');
if (process.env.NODE_ENV !== 'test') fs.mkdirSync(dataDirectory, { recursive: true });
const db = new Database(process.env.NODE_ENV === 'test' ? ':memory:' : path.join(dataDirectory, 'tasks.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const toTask = (row) => row && ({ ...row, completed: Boolean(row.completed) });
const getTask = db.prepare('SELECT * FROM tasks WHERE id = ?');
const taskOrder = `
  ORDER BY completed ASC,
    CASE WHEN due_date IS NULL OR due_date = '' THEN 1 ELSE 0 END ASC,
    due_date ASC,
    created_at ASC
`;

app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare(`SELECT * FROM tasks ${taskOrder}`).all().map(toTask);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, description = '', due_date: dueDate = null } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const result = db.prepare('INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)')
      .run(title.trim(), typeof description === 'string' ? description.trim() : '', dueDate || null);
    res.status(201).json(toTask(getTask.get(result.lastInsertRowid)));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const existingTask = getTask.get(id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const title = req.body.title === undefined ? existingTask.title : req.body.title;
    const description = req.body.description === undefined ? existingTask.description : req.body.description;
    const dueDate = req.body.due_date === undefined ? existingTask.due_date : req.body.due_date || null;
    const completed = req.body.completed === undefined ? existingTask.completed : req.body.completed;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }
    if (typeof completed !== 'boolean' && completed !== 0 && completed !== 1) {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }

    db.prepare('UPDATE tasks SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ?')
      .run(title.trim(), typeof description === 'string' ? description.trim() : '', dueDate, Boolean(completed) ? 1 : 0, id);
    res.json(toTask(getTask.get(id)));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    if (!getTask.get(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };