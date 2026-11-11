const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const limiteIA = require('../middlewares/limiteIA');
const claude = require('../services/claude.service');

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
  const r = await claude.preguntar(req.body.pregunta);
  res.json(r);
});

module.exports = router;
