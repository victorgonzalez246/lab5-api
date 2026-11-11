const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const notas = require('../services/notas.service');
const claude = require('../services/claude.service');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

router.get('/', (req, res) => res.json(notas.listar()));

router.post('/', validar(notaSchema), (req, res) =>
  res.status(201).json(notas.crear(req.body)));

router.post('/:id/resumen', async (req, res) => {
  const nota = notas.buscar(Number(req.params.id)); // 404 si no existe
  const r = await claude.preguntar(
    nota.contenido,
    'Resume el texto en 3 viñetas breves, en español.'
  );
  res.json({ notaId: nota.id, resumen: r.respuesta });
});

module.exports = router;
