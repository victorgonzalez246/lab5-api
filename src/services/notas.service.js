const { Nota } = require('../models');
const { AppError } = require('../utils/errors');

const listar = () => Nota.findAll({ order: [['id', 'ASC']] });

async function buscar(id) {
  // Un id que no es un entero (por ejemplo /api/notas/abc) tampoco existe.
  const n = Number.isInteger(id) ? await Nota.findByPk(id) : null;
  if (!n) throw new AppError(404, 'Nota no encontrada');
  return n;
}

const crear = ({ titulo, contenido }) => Nota.create({ titulo, contenido });

async function actualizar(id, { titulo, contenido }) {
  await buscar(id); // lanza el 404 si no existe
  const n = await Nota.findByPk(id);
  return n.update({ titulo, contenido });
}

async function eliminar(id) {
  await buscar(id); // lanza el 404 si no existe
  const n = await Nota.findByPk(id);
  await n.destroy();
}

module.exports = { listar, buscar, crear, actualizar, eliminar };
