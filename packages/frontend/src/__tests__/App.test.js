import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const tasks = [
  { id: 1, title: 'Write tests', description: 'Cover the task flow', due_date: '2099-01-01', completed: false, created_at: '2026-01-01' },
  { id: 2, title: 'Ship release', description: '', due_date: null, completed: true, created_at: '2026-01-02' },
];

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(200), ctx.json(tasks))),
  rest.post('/api/tasks', async (req, res, ctx) => res(ctx.status(201), ctx.json({ ...await req.json(), id: 3, completed: false, created_at: '2026-01-03' }))),
  rest.patch('/api/tasks/:id', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(200), ctx.json({ ...tasks[0], ...body, id: Number(req.params.id) }));
  }),
  rest.delete('/api/tasks/:id', (req, res, ctx) => res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(req.params.id) })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Task app', () => {
  test('loads and displays tasks', async () => {
    render(<App />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    expect(await screen.findByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Ship release')).toBeInTheDocument();
  });

  test('adds a task', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Write tests');
    await user.type(screen.getByRole('textbox', { name: /Task title/ }), 'New task');
    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(await screen.findByText('New task')).toBeInTheDocument();
    expect(screen.getByText('Task added')).toBeInTheDocument();
  });

  test('filters and searches tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Write tests');
    await user.click(screen.getByRole('combobox', { name: 'Show' }));
    await user.click(screen.getByRole('option', { name: 'Completed' }));
    expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    expect(screen.getByText('Ship release')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: 'Show' }));
    await user.click(screen.getByRole('option', { name: 'All tasks' }));
    await user.type(screen.getByRole('textbox', { name: 'Search tasks' }), 'tests');
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.queryByText('Ship release')).not.toBeInTheDocument();
  });

  test('completes a task', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Write tests');
    await user.click(screen.getByRole('checkbox', { name: /Mark Write tests complete/ }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /Mark Write tests incomplete/ })).toBeChecked());
  });

  test('confirms and deletes a task', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Write tests');
    await user.click(screen.getByRole('button', { name: 'Delete Write tests' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete', exact: true }));
    await waitFor(() => expect(screen.queryByText('Write tests')).not.toBeInTheDocument());
  });

  test('shows empty state and API errors', async () => {
    server.use(rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(500), ctx.json({ error: 'Failed to fetch tasks' }))));
    render(<App />);
    expect(await screen.findByText('Failed to fetch tasks')).toBeInTheDocument();

    server.resetHandlers();
    server.use(rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(200), ctx.json([]))));
    render(<App />);
    expect(await screen.findByText('No tasks match this view.')).toBeInTheDocument();
  });
});
