const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const notas = require('../services/notas.service');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

router.get('/', (req, res) => res.json(notas.listar()));

router.post('/', validar(notaSchema), (req, res) =>
  res.status(201).json(notas.crear(req.body)));

module.exports = router;
