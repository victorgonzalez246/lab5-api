const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const notas = require('../services/notas.service');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

router.get('/', (req, res) => res.json(notas.listar()));

router.get('/:id', (req, res) =>
  res.json(notas.buscar(Number(req.params.id))));

router.post('/', validar(notaSchema), (req, res) =>
  res.status(201).json(notas.crear(req.body)));

router.delete('/:id', (req, res) => {
  notas.eliminar(Number(req.params.id));
  res.status(204).end();
});

module.exports = router;
