// Pruebas de la API con supertest. claude.service se simula,
// así que no se hace ninguna llamada real ni se gastan créditos.
process.env.ANTHROPIC_API_KEY = 'sk-ant-clave-de-prueba';
process.env.CLAUDE_MODEL = 'modelo-de-prueba';
process.env.IA_LIMITE_POR_MINUTO = '100';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const Anthropic = require('@anthropic-ai/sdk');

const claude = require('../src/services/claude.service');
const app = require('../src/app');

let llamadas;

beforeEach(() => {
  llamadas = [];
  claude.preguntar = async (texto, system) => {
    llamadas.push({ texto, system });
    return {
      respuesta: 'respuesta simulada',
      uso: { input_tokens: 10, output_tokens: 20 },
    };
  };
});

const nota = { titulo: 'REST', contenido: 'REST usa verbos HTTP sobre recursos.' };

test('POST /api/notas crea la nota y responde 201 con id', async () => {
  const res = await request(app).post('/api/notas').send(nota);
  assert.equal(res.status, 201);
  assert.equal(typeof res.body.id, 'number');
  assert.equal(res.body.titulo, nota.titulo);
});

test('GET /api/notas lista las notas creadas', async () => {
  const creada = (await request(app).post('/api/notas').send(nota)).body;
  const res = await request(app).get('/api/notas');
  assert.equal(res.status, 200);
  assert.ok(res.body.some((n) => n.id === creada.id));
});

test('GET /api/notas/:id devuelve la nota', async () => {
  const creada = (await request(app).post('/api/notas').send(nota)).body;
  const res = await request(app).get(`/api/notas/${creada.id}`);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, creada);
});

test('GET /api/notas/99999 responde 404', async () => {
  const res = await request(app).get('/api/notas/99999');
  assert.equal(res.status, 404);
  assert.deepEqual(res.body, { error: 'Nota no encontrada' });
});

test('POST /api/notas con body vacío responde 400 con detalles de Zod', async () => {
  const res = await request(app).post('/api/notas').send({});
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Datos inválidos');
  assert.ok(res.body.errores.length >= 2);
});

test('POST /api/notas con JSON mal formado responde 400', async () => {
  const res = await request(app)
    .post('/api/notas')
    .set('Content-Type', 'application/json')
    .send('{"titulo": ');
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, { error: 'JSON inválido' });
});

test('DELETE /api/notas/:id responde 204 y después la nota da 404', async () => {
  const creada = (await request(app).post('/api/notas').send(nota)).body;
  const borrar = await request(app).delete(`/api/notas/${creada.id}`);
  assert.equal(borrar.status, 204);
  const res = await request(app).get(`/api/notas/${creada.id}`);
  assert.equal(res.status, 404);
});

test('DELETE de una nota que no existe responde 404', async () => {
  const res = await request(app).delete('/api/notas/99999');
  assert.equal(res.status, 404);
});

test('POST /api/ia/preguntar responde 200 con respuesta y uso de tokens', async () => {
  const res = await request(app)
    .post('/api/ia/preguntar')
    .send({ pregunta: '¿Qué es REST?' });
  assert.equal(res.status, 200);
  assert.equal(res.body.respuesta, 'respuesta simulada');
  assert.deepEqual(res.body.uso, { input_tokens: 10, output_tokens: 20 });
  assert.equal(llamadas[0].texto, '¿Qué es REST?');
});

test('POST /api/ia/preguntar con 1 letra responde 400 sin llamar a Claude', async () => {
  const res = await request(app).post('/api/ia/preguntar').send({ pregunta: 'a' });
  assert.equal(res.status, 400);
  assert.equal(llamadas.length, 0);
});

test('POST /api/notas/:id/resumen envía el contenido con el prompt de sistema', async () => {
  const creada = (await request(app).post('/api/notas').send(nota)).body;
  const res = await request(app).post(`/api/notas/${creada.id}/resumen`);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { notaId: creada.id, resumen: 'respuesta simulada' });
  assert.equal(llamadas[0].texto, nota.contenido);
  assert.match(llamadas[0].system, /3 viñetas/);
});

test('resumen de una nota que no existe responde 404 sin llamar a Claude', async () => {
  const res = await request(app).post('/api/notas/99999/resumen');
  assert.equal(res.status, 404);
  assert.equal(llamadas.length, 0);
});

// Errores de la Claude API: status que devuelve Claude -> status de nuestra API.
for (const [deClaude, esperado] of [[401, 502], [400, 502], [429, 429], [529, 503]]) {
  test(`un ${deClaude} de Claude se responde como ${esperado} sin detalles`, async () => {
    claude.preguntar = async () => {
      throw Anthropic.APIError.generate(
        deClaude,
        { type: 'error', error: { type: 'x', message: 'detalle secreto de la cuenta' } },
        'detalle secreto de la cuenta',
        new Headers()
      );
    };
    const res = await request(app)
      .post('/api/ia/preguntar')
      .send({ pregunta: '¿Qué es REST?' });
    assert.equal(res.status, esperado);
    assert.deepEqual(res.body, { error: 'IA_NO_DISPONIBLE' });
  });
}

test('la especificación OpenAPI documenta los 7 endpoints', () => {
  const spec = require('../src/config/swagger');
  const operaciones = Object.entries(spec.paths).flatMap(([ruta, metodos]) =>
    Object.keys(metodos).map((m) => `${m.toUpperCase()} ${ruta}`));
  assert.deepEqual(operaciones.sort(), [
    'DELETE /api/notas/{id}',
    'GET /api-docs',
    'GET /api/notas',
    'GET /api/notas/{id}',
    'POST /api/ia/preguntar',
    'POST /api/notas',
    'POST /api/notas/{id}/resumen',
  ]);
});

test('GET /api-docs sirve Swagger UI', async () => {
  const res = await request(app).get('/api-docs/');
  assert.equal(res.status, 200);
  assert.match(res.text, /swagger-ui/i);
});

test('una ruta que no existe responde 404 en JSON', async () => {
  const res = await request(app).get('/api/nada');
  assert.equal(res.status, 404);
  assert.deepEqual(res.body, { error: 'Ruta no encontrada' });
});
