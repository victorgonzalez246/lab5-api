const path = require('node:path');
const { Sequelize } = require('sequelize');

function obtenerArchivo() {
  const url = process.env.DATABASE_URL || 'file:./dev.db';
  if (!url.startsWith('file:')) {
    throw new Error('DATABASE_URL debe usar SQLite con el formato file:./archivo.db');
  }

  const archivo = url.slice('file:'.length);
  return path.isAbsolute(archivo)
    ? archivo
    : path.resolve(__dirname, '../../data', archivo);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: obtenerArchivo(),
  logging: false,
});

module.exports = sequelize;
