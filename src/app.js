const express = require('express');
const swaggerUi = require('swagger-ui-express');
const spec = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

/**
 * @openapi
 * /api-docs:
 *   get:
 *     summary: Documentación interactiva (Swagger UI)
 *     tags: [Documentación]
 *     responses:
 *       200: { description: Página de Swagger UI }
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/api/notas', require('./routes/notas.routes'));
app.use('/api/ia', require('./routes/ia.routes'));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(errorHandler); // siempre al final

module.exports = app;
