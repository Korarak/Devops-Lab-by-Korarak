const request = require('supertest');

jest.mock('../db', () => ({
  query: jest.fn(),
}));
const db = require('../db');
const app = require('../index');

describe('POST /api/products — validation', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ category: 'Electronics', price: 1000, stock: 5 });
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when category is missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 100, stock: 10 });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/stats', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns stats object with overview and by_category', async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [{ total_products: '10', total_stock: '243', total_value: '166750.00', out_of_stock: '0', low_stock: '2' }],
      })
      .mockResolvedValueOnce({
        rows: [{ category: 'Electronics', products: '5', total_stock: '55', total_value: '139680.00' }],
      });

    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('overview');
    expect(res.body).toHaveProperty('by_category');
    expect(res.body.overview).toHaveProperty('total_products');
    expect(Array.isArray(res.body.by_category)).toBe(true);
  });
});
