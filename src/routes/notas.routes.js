const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
const limiteIA = require('../middlewares/limiteIA');
const notas = require('../services/notas.service');
const claude = require('../services/claude.service');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

/**
 * @openapi
 * /api/notas:
 *   get:
 *     summary: Lista todas las notas
 *     tags: [Notas]
 *     responses:
 *       200: { description: Lista de notas }
 */
router.get('/', (req, res) => res.json(notas.listar()));

/**
 * @openapi
 * /api/notas/{id}:
 *   get:
 *     summary: Obtiene una nota
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: La nota solicitada }
 *       404: { description: Nota no encontrada }
 */
router.get('/:id', (req, res) =>
  res.json(notas.buscar(Number(req.params.id))));

/**
 * @openapi
 * /api/notas:
 *   post:
 *     summary: Crea una nota
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       201: { description: Nota creada con su id }
 *       400: { description: Datos inválidos }
 */
router.post('/', validar(notaSchema), (req, res) =>
  res.status(201).json(notas.crear(req.body)));

/**
 * @openapi
 * /api/notas/{id}:
 *   delete:
 *     summary: Elimina una nota
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Nota eliminada }
 *       404: { description: Nota no encontrada }
 */
router.delete('/:id', (req, res) => {
  notas.eliminar(Number(req.params.id));
  res.status(204).end();
});

/**
 * @openapi
 * /api/notas/{id}/resumen:
 *   post:
 *     summary: Resume una nota en 3 viñetas con Claude
 *     tags: [IA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Resumen de la nota }
 *       404: { description: Nota no encontrada }
 *       429: { description: Demasiadas peticiones }
 *       502: { description: Claude no disponible }
 *       503: { description: Claude saturado temporalmente }
 */
router.post('/:id/resumen', limiteIA(), async (req, res) => {
  const nota = notas.buscar(Number(req.params.id)); // 404 si no existe
  const r = await claude.preguntar(
    nota.contenido,
    'Resume el texto en 3 viñetas breves, en español.'
  );
  res.json({ notaId: nota.id, resumen: r.respuesta });
});

module.exports = router;
