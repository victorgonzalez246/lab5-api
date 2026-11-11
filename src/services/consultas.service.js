// Historial de las preguntas hechas a Claude y de los tokens que gastó cada una.
const { Consulta } = require('../models');

const registrar = ({ pregunta, respuesta, uso }) =>
  Consulta.create({
      pregunta,
      respuesta,
      inputTokens: uso.input_tokens,
      outputTokens: uso.output_tokens,
  });

// Las más recientes primero.
const listar = (limite = 50) =>
  Consulta.findAll({ order: [['id', 'DESC']], limit: limite });

module.exports = { registrar, listar };
