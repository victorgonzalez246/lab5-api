const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const claude = require('../services/claude.service');

const preguntaSchema = z.object({
  pregunta: z.string().min(3).max(2000),
});

router.post('/preguntar', validar(preguntaSchema), async (req, res) => {
  const r = await claude.preguntar(req.body.pregunta);
  res.json(r);
});

module.exports = router;
