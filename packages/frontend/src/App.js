import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert, AppBar, Box, Button, Checkbox, Chip, Container, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField,
  Toolbar, Tooltip, Typography,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import './App.css';

const emptyForm = { title: '', description: '', due_date: '' };

const request = async (url, options) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Something went wrong');
  return body;
};

const isOverdue = (task) => task.due_date && !task.completed && task.due_date < new Date().toISOString().slice(0, 10);

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      setTasks(await request('/api/tasks'));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed);
    const query = search.trim().toLowerCase();
    return matchesFilter && (!query || `${task.title} ${task.description}`.toLowerCase().includes(query));
  }), [filter, search, tasks]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const url = editingId ? `/api/tasks/${editingId}` : '/api/tasks';
      const method = editingId ? 'PATCH' : 'POST';
      const savedTask = await request(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setTasks((current) => editingId ? current.map((task) => task.id === editingId ? savedTask : task) : [...current, savedTask]);
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Task updated' : 'Task added');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = await request(`/api/tasks/${task.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !task.completed }) });
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await request(`/api/tasks/${deleteTarget.id}`, { method: 'DELETE' });
      setTasks((current) => current.filter((task) => task.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice('Task deleted');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description || '', due_date: task.due_date || '' });
    setError('');
  };

  return (
    <Box className="app-shell">
      <AppBar position="static" elevation={0} className="app-bar">
        <Toolbar><Typography variant="h5" component="h1">Task List</Typography></Toolbar>
      </AppBar>
      <Container maxWidth="md" component="main" className="app-content">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" component="h2" gutterBottom>Make room for what matters.</Typography>
            <Typography color="text.secondary">Plan the next small thing, then let the list hold the rest.</Typography>
          </Box>

          <Paper component="form" onSubmit={handleSubmit} className="task-form" elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h6">{editingId ? 'Edit task' : 'Add a task'}</Typography>
              <TextField required label="Task title" name="title" value={form.title} onChange={handleChange} autoComplete="off" />
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline minRows={2} />
              <TextField label="Due date" name="due_date" type="date" value={form.due_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" startIcon={editingId ? <SaveOutlinedIcon /> : <AddIcon />} disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save task' : 'Add task'}
                </Button>
                {editingId && <Button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
              </Stack>
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <TextField fullWidth label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="filter-label">Show</InputLabel>
              <Select labelId="filter-label" label="Show" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <MenuItem value="all">All tasks</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
          {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}

          <Box component="section" aria-labelledby="tasks-heading">
            <Typography id="tasks-heading" variant="h6" gutterBottom>Tasks</Typography>
            {loading && <Typography color="text.secondary">Loading tasks...</Typography>}
            {!loading && visibleTasks.length === 0 && <Typography color="text.secondary">No tasks match this view.</Typography>}
            <Stack component="ul" spacing={1} className="task-list">
              {visibleTasks.map((task) => (
                <Paper component="li" key={task.id} className={`task-row ${task.completed ? 'is-complete' : ''}`} elevation={0}>
                  <Checkbox checked={task.completed} onChange={() => toggleTask(task)} slotProps={{ input: { 'aria-label': `Mark ${task.title} ${task.completed ? 'incomplete' : 'complete'}` } }} />
                  <Box className="task-details">
                    <Typography component="span" className="task-title">{task.title}</Typography>
                    {task.description && <Typography variant="body2" color="text.secondary">{task.description}</Typography>}
                    {task.due_date && <Chip size="small" label={isOverdue(task) ? `Overdue: ${task.due_date}` : `Due: ${task.due_date}`} color={isOverdue(task) ? 'warning' : 'default'} />}
                  </Box>
                  <Stack direction="row" className="task-actions">
                    <Tooltip title="Edit task"><IconButton aria-label={`Edit ${task.title}`} onClick={() => startEdit(task)}><EditOutlinedIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete task"><IconButton aria-label={`Delete ${task.title}`} onClick={() => setDeleteTarget(task)} color="error"><DeleteOutlinedIcon /></IconButton></Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete task?</DialogTitle>
        <DialogContent><DialogContentText>This will permanently remove "{deleteTarget?.title}".</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setDeleteTarget(null)}>Cancel</Button><Button onClick={confirmDelete} color="error" variant="contained">Delete</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
