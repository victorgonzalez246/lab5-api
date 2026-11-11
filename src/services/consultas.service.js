// Historial de las preguntas hechas a Claude y de los tokens que gastó cada una.
const prisma = require('../config/prisma');

const registrar = ({ pregunta, respuesta, uso }) =>
  prisma.consulta.create({
    data: {
      pregunta,
      respuesta,
      inputTokens: uso.input_tokens,
      outputTokens: uso.output_tokens,
    },
  });

// Las más recientes primero.
const listar = (limite = 50) =>
  prisma.consulta.findMany({ orderBy: { id: 'desc' }, take: limite });

module.exports = { registrar, listar };
