const prisma = require('../config/prisma');
const { AppError } = require('../utils/errors');

const listar = () => prisma.nota.findMany({ orderBy: { id: 'asc' } });

async function buscar(id) {
  // Un id que no es un entero (por ejemplo /api/notas/abc) tampoco existe.
  const n = Number.isInteger(id)
    ? await prisma.nota.findUnique({ where: { id } })
    : null;
  if (!n) throw new AppError(404, 'Nota no encontrada');
  return n;
}

const crear = ({ titulo, contenido }) =>
  prisma.nota.create({ data: { titulo, contenido } });

async function actualizar(id, { titulo, contenido }) {
  await buscar(id); // lanza el 404 si no existe
  return prisma.nota.update({ where: { id }, data: { titulo, contenido } });
}

async function eliminar(id) {
  await buscar(id); // lanza el 404 si no existe
  await prisma.nota.delete({ where: { id } });
}

module.exports = { listar, buscar, crear, actualizar, eliminar };
