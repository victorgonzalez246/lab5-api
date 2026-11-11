const router = require('express').Router();
const { z } = require('zod');
const validar = require('../middlewares/validar');
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
 *       200:
 *         description: Lista de notas (vacía si aún no hay ninguna)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nota'
 */
router.get('/', (req, res) => res.json(notas.listar()));

/**
 * @openapi
 * /api/notas/{id}:
 *   get:
 *     summary: Obtiene una nota por su id
 *     tags: [Notas]
 *     parameters:
 *       - $ref: '#/components/parameters/NotaId'
 *     responses:
 *       200:
 *         description: La nota solicitada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       404:
 *         $ref: '#/components/responses/NotaNoEncontrada'
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
 *       201:
 *         description: Nota creada, con su id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         $ref: '#/components/responses/DatosInvalidos'
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
 *       - $ref: '#/components/parameters/NotaId'
 *     responses:
 *       204:
 *         description: Nota eliminada (sin contenido)
 *       404:
 *         $ref: '#/components/responses/NotaNoEncontrada'
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
 *       - $ref: '#/components/parameters/NotaId'
 *     responses:
 *       200:
 *         description: Resumen generado por el modelo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resumen'
 *       404:
 *         $ref: '#/components/responses/NotaNoEncontrada'
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
router.post('/:id/resumen', async (req, res) => {
  const nota = notas.buscar(Number(req.params.id)); // 404 si no existe
  const r = await claude.preguntar(
    nota.contenido,
    'Resume el texto en 3 viñetas breves, en español.'
  );
  res.json({ notaId: nota.id, resumen: r.respuesta });
});

module.exports = router;
