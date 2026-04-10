const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db'); // ✅ make sure you export sequelize from config/db.js

let userToken;
let adminToken;

beforeAll(async () => {
  // Reset DB schema before tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close DB connection after tests
  await sequelize.close();
});

describe('Auth & Role Tests', () => {
  test('Register user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.role).toBe('user');
  });

  test('Register admin', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'admin1', password: 'adminpass', role: 'admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('admin1');
    expect(res.body.user.role).toBe('admin');
  });

  test('Login user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  test('Login admin', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin1', password: 'adminpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });
});

describe('Feedback & Admin Tests', () => {
  test('User can submit feedback', async () => {
    const res = await request(app)
      .post('/feedback')
      .set('Authorization', userToken)
      .send({ text: 'Great app!', rating: 5, category: 'UI' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('feedback');
    expect(res.body.feedback.sentiment).toBe('positive');
  });

  test('Admin can view feedbacks', async () => {
    const res = await request(app)
      .get('/admin/feedbacks')
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('User cannot access admin routes', async () => {
    const res = await request(app)
      .get('/admin/feedbacks')
      .set('Authorization', userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Admin access required');
  });

  test('Admin dashboard aggregates data', async () => {
    const res = await request(app)
      .get('/admin/dashboard')
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('feedbackCount');
    expect(res.body).toHaveProperty('userCount');
    expect(res.body.feedbackCount).toBeGreaterThanOrEqual(1);
    expect(res.body.userCount).toBeGreaterThanOrEqual(2);
  });
});
