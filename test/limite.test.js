// Comprueba el límite de peticiones de las rutas de IA (reto extra "Rate limit").
process.env.ANTHROPIC_API_KEY = 'sk-ant-clave-de-prueba';
process.env.IA_LIMITE_POR_MINUTO = '3';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const claude = require('../src/services/claude.service');
const app = require('../src/app');

claude.preguntar = async () => ({
  respuesta: 'ok',
  uso: { input_tokens: 1, output_tokens: 1 },
});

test('la cuarta pregunta en un minuto responde 429', async () => {
  const preguntar = () =>
    request(app).post('/api/ia/preguntar').send({ pregunta: '¿Qué es REST?' });

  for (let i = 0; i < 3; i++) {
    assert.equal((await preguntar()).status, 200);
  }
  const res = await preguntar();
  assert.equal(res.status, 429);
  assert.deepEqual(res.body, { error: 'DEMASIADAS_PETICIONES' });
});

test('el CRUD de notas no tiene límite', async () => {
  for (let i = 0; i < 10; i++) {
    assert.equal((await request(app).get('/api/notas')).status, 200);
  }
});
