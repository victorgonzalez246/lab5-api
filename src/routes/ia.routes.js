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
 *       200:
 *         description: Respuesta del modelo y tokens consumidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaIA'
 *       400:
 *         $ref: '#/components/responses/DatosInvalidos'
 *       429:
 *         $ref: '#/components/responses/DemasiadasPeticiones'
 *       502:
 *         $ref: '#/components/responses/IANoDisponible'
 *       503:
 *         description: Claude saturado temporalmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/preguntar', limiteIA(), validar(preguntaSchema), async (req, res) => {
  const r = await claude.preguntar(req.body.pregunta);
  res.json(r);
});

module.exports = router;
