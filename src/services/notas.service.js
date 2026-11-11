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

function eliminar(id) {
  const n = buscar(id); // lanza el 404 si no existe
  notas = notas.filter((x) => x.id !== n.id);
}

module.exports = { listar, buscar, crear, eliminar };
