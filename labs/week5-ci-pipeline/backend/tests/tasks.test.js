const request = require('supertest');

// Mock database ก่อน require app
jest.mock('../db', () => ({
  query: jest.fn(),
}));
const db  = require('../db');
const app = require('../index');

describe('GET /api/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with array of tasks', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1, title: 'ออกแบบ UI สำหรับ Dashboard',
          status: 'in-progress', priority: 'high',
          assignee: 'ปิยะ', due_date: '2026-06-30', description: 'ออกแบบ layout หน้า Dashboard',
        },
        {
          id: 2, title: 'เขียน API endpoint /tasks',
          status: 'done', priority: 'high',
          assignee: 'สมชาย', due_date: '2026-06-10', description: 'RESTful API ครบ CRUD',
        },
      ],
    });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('title', 'ออกแบบ UI สำหรับ Dashboard');
  });

  test('returns 200 empty array when no tasks', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/tasks/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with single task', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1, title: 'ออกแบบ UI สำหรับ Dashboard',
        status: 'in-progress', priority: 'high',
        assignee: 'ปิยะ', due_date: '2026-06-30', description: '',
      }],
    });

    const res = await request(app).get('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'ออกแบบ UI สำหรับ Dashboard');
  });

  test('returns 404 when task not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/tasks/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates task and returns 201 with created task', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 3, title: 'งานทดสอบ',
        status: 'todo', priority: 'medium',
        assignee: 'ปิยะ', due_date: null, description: '',
      }],
    });

    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'งานทดสอบ', status: 'todo', priority: 'medium', assignee: 'ปิยะ' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'งานทดสอบ');
  });
});

describe('DELETE /api/tasks/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 when task deleted', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'งานที่ลบ', status: 'todo', priority: 'low' }],
    });

    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('deleted');
  });

  test('returns 404 when task not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/tasks/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
