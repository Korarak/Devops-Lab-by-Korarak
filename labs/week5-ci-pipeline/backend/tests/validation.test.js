const request = require('supertest');

// Mock database ก่อน require app
jest.mock('../db', () => ({
  query: jest.fn(),
}));
const db  = require('../db');
const app = require('../index');

describe('POST /api/tasks — validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ status: 'todo', priority: 'medium' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when status is invalid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'งานทดสอบ', status: 'invalid-status' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when priority is invalid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'งานทดสอบ', priority: 'urgent' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 201 when only title is provided (optional fields omitted)', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 5, title: 'งานใหม่',
        status: 'todo', priority: 'medium',
        assignee: '', due_date: null, description: '',
      }],
    });

    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'งานใหม่' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'งานใหม่');
  });
});
