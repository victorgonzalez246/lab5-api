const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lab 5: Notas + IA', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Nota: {
          type: 'object',
          required: ['titulo', 'contenido'],
          properties: {
            titulo: { type: 'string', example: 'Apuntes de REST' },
            contenido: {
              type: 'string',
              example: 'REST es un estilo de arquitectura para APIs. Usa los verbos HTTP sobre recursos identificados por URL y no guarda estado entre peticiones.',
            },
          },
        },
        Pregunta: {
          type: 'object',
          required: ['pregunta'],
          properties: { pregunta: { type: 'string', example: '¿Qué es REST?' } },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'], // dónde leer los @openapi
});
