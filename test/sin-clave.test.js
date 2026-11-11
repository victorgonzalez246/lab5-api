// Sin API key configurada, los endpoints de IA responden 502 en vez de un 500.
// Se deja vacía en vez de borrarla para simular una variable sin configurar.
process.env.ANTHROPIC_API_KEY = '';
require('../scripts/preparar-bd-pruebas')('sin-clave');

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

const { sequelize } = require('../src/models');
before(() => sequelize.sync({ force: true }));
after(() => sequelize.close());

test('sin ANTHROPIC_API_KEY, preguntar responde 502 IA_NO_DISPONIBLE', async () => {
  const res = await request(app)
    .post('/api/ia/preguntar')
    .send({ pregunta: '¿Qué es REST?' });
  assert.equal(res.status, 502);
  assert.deepEqual(res.body, { error: 'IA_NO_DISPONIBLE' });
});
