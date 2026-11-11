const { AppError } = require('../utils/errors');

// Las notas viven en memoria: se pierden al reiniciar el servidor.
let notas = [];
let nextId = 1;

const listar = () => notas;

function buscar(id) {
  const n = notas.find((n) => n.id === id);
  if (!n) throw new AppError(404, 'Nota no encontrada');
  return n;
}

function crear({ titulo, contenido }) {
  const n = { id: nextId++, titulo, contenido };
  notas.push(n);
  return n;
}

module.exports = { listar, buscar, crear };
