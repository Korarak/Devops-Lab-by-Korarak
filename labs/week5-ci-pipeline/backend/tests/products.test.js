const request = require('supertest');

// Mock database ก่อน require app
jest.mock('../db', () => ({
  query: jest.fn(),
}));
const db = require('../db');
const app = require('../index');

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with array of products', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'MacBook Air M3', category: 'Electronics', price: '44900.00', stock: 15, description: '' },
        { id: 2, name: 'iPhone 16 Pro',  category: 'Electronics', price: '42900.00', stock: 8,  description: '' },
      ],
    });

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name', 'MacBook Air M3');
  });

  test('returns empty array when no products', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates product and returns 201 with id', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 3, name: 'Nike Air Max', category: 'Footwear', price: '4590.00', stock: 32 }],
    });

    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Nike Air Max', category: 'Footwear', price: 4590, stock: 32 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Nike Air Max');
  });
});
