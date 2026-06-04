const request = require('supertest');
const app = require('../index');

describe('GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('returns version field', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('version');
    expect(typeof res.body.version).toBe('string');
  });

  test('returns uptime as a number', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
