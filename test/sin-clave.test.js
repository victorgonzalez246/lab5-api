// Sin API key configurada, los endpoints de IA responden 502 en vez de un 500.
delete process.env.ANTHROPIC_API_KEY;

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('sin ANTHROPIC_API_KEY, preguntar responde 502 IA_NO_DISPONIBLE', async () => {
  const res = await request(app)
    .post('/api/ia/preguntar')
    .send({ pregunta: '¿Qué es REST?' });
  assert.equal(res.status, 502);
  assert.deepEqual(res.body, { error: 'IA_NO_DISPONIBLE' });
});
