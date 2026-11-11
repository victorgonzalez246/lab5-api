const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const limiteIA = require('../middlewares/limiteIA');
const claude = require('../services/claude.service');
const consultas = require('../services/consultas.service');

const preguntaSchema = z.object({
  pregunta: z.string().min(3).max(2000),
});

/**
 * @openapi
 * /api/ia/preguntar:
 *   post:
 *     summary: Envía una pregunta a Claude
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pregunta'
 *     responses:
 *       200: { description: Respuesta del modelo }
 *       400: { description: Datos inválidos }
 *       429: { description: Demasiadas peticiones }
 *       502: { description: Claude no disponible }
 *       503: { description: Claude saturado temporalmente }
 */
router.post('/preguntar', limiteIA(), validar(preguntaSchema), async (req, res) => {
  const { pregunta } = req.body;
  const r = await claude.preguntar(pregunta);
  await consultas.registrar({ pregunta, respuesta: r.respuesta, uso: r.uso });
  res.json({ pregunta, respuesta: r.respuesta, uso: r.uso });
});

/**
 * @openapi
 * /api/ia/historial:
 *   get:
 *     summary: Lista las preguntas hechas a Claude y sus tokens
 *     tags: [IA]
 *     responses:
 *       200: { description: Historial de consultas }
 */
router.get('/historial', async (req, res) => res.json(await consultas.listar()));

module.exports = router;
