const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => db.close());

const createTask = async (task = { title: 'Task to delete' }) => {
  const response = await request(app).post('/api/tasks').send(task);
  expect(response.status).toBe(201);
  return response.body;
};

describe('Task API', () => {
  test('returns tasks in completion and due-date order', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('creates a task with optional details', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Plan release',
      description: 'Review the checklist',
      due_date: '2026-10-01',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Plan release',
      description: 'Review the checklist',
      due_date: '2026-10-01',
      completed: false,
    });
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('created_at');
  });

  test.each([{}, { title: '   ' }, { title: 42 }])('rejects invalid title: %o', async (task) => {
    const response = await request(app).post('/api/tasks').send(task);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Task title is required' });
  });

  test('updates a task and its completion state', async () => {
    const task = await createTask();
    const response = await request(app).patch(`/api/tasks/${task.id}`).send({
      title: 'Updated task',
      completed: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ title: 'Updated task', completed: true });
  });

  test('deletes an existing task and rejects unknown tasks', async () => {
    const task = await createTask();
    const response = await request(app).delete(`/api/tasks/${task.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task deleted successfully', id: task.id });
    expect((await request(app).delete(`/api/tasks/${task.id}`)).status).toBe(404);
  });

  test('rejects invalid task identifiers when updating', async () => {
    const response = await request(app).patch('/api/tasks/not-a-number').send({ title: 'Updated task' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Valid task ID is required' });
  });

  test('returns 404 for a missing task update', async () => {
    const response = await request(app).patch('/api/tasks/999999').send({ title: 'Ghost task' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Task not found' });
  });

  test('rejects blank task titles during updates', async () => {
    const task = await createTask();
    const response = await request(app).patch(`/api/tasks/${task.id}`).send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Task title is required' });
  });

  test('rejects non-boolean completed values during updates', async () => {
    const task = await createTask();
    const response = await request(app).patch(`/api/tasks/${task.id}`).send({ completed: 'yes' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Completed must be a boolean' });
  });

  test('rejects invalid task identifiers', async () => {
    const response = await request(app).delete('/api/tasks/not-a-number');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Valid task ID is required' });
  });
});