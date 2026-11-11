const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lab 5: Notas + IA',
      version: '1.0.0',
      description:
        'API de notas con dos funciones de IA: preguntas libres y resumen de notas con Claude.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [
      { name: 'Notas', description: 'CRUD de notas en memoria' },
      { name: 'IA', description: 'Endpoints que llaman a la Claude API' },
      { name: 'Documentación', description: 'Swagger UI' },
    ],
    components: {
      schemas: {
        Nota: {
          type: 'object',
          required: ['titulo', 'contenido'],
          properties: {
            id: { type: 'integer', readOnly: true, example: 1 },
            titulo: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'Apuntes de REST',
            },
            contenido: {
              type: 'string',
              minLength: 1,
              maxLength: 5000,
              example:
                'REST es un estilo de arquitectura para APIs. Usa los verbos HTTP sobre recursos identificados por URL y no guarda estado entre peticiones.',
            },
          },
        },
        Pregunta: {
          type: 'object',
          required: ['pregunta'],
          properties: {
            pregunta: {
              type: 'string',
              minLength: 3,
              maxLength: 2000,
              example: '¿Qué es REST?',
            },
          },
        },
        RespuestaIA: {
          type: 'object',
          properties: {
            respuesta: { type: 'string', example: 'REST es un estilo de arquitectura…' },
            uso: {
              type: 'object',
              properties: {
                input_tokens: { type: 'integer', example: 18 },
                output_tokens: { type: 'integer', example: 142 },
              },
            },
          },
        },
        Resumen: {
          type: 'object',
          properties: {
            notaId: { type: 'integer', example: 1 },
            resumen: { type: 'string', example: '• Punto 1\n• Punto 2\n• Punto 3' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Nota no encontrada' },
          },
        },
        ErrorValidacion: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Datos inválidos' },
            errores: {
              type: 'array',
              description: 'Detalle de cada campo que no pasó la validación de Zod',
              items: { type: 'object' },
            },
          },
        },
      },
      parameters: {
        NotaId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Identificador numérico de la nota',
          schema: { type: 'integer', example: 1 },
        },
      },
      responses: {
        NotaNoEncontrada: {
          description: 'Nota no encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        DatosInvalidos: {
          description: 'Datos inválidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorValidacion' },
            },
          },
        },
        DemasiadasPeticiones: {
          description: 'Demasiadas peticiones a la IA; reintentar más tarde',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { error: 'DEMASIADAS_PETICIONES' },
            },
          },
        },
        IASaturada: {
          description: 'Claude saturado temporalmente; reintentar más tarde',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { error: 'IA_NO_DISPONIBLE' },
            },
          },
        },
        IANoDisponible: {
          description: 'Claude no disponible',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { error: 'IA_NO_DISPONIBLE' },
            },
          },
        },
      },
    },
  },
  // dónde leer los comentarios @openapi
  apis: ['./src/routes/*.js', './src/app.js'],
});
