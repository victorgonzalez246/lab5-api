const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const opcionesFechas = {
  timestamps: true,
  createdAt: 'creadaEn',
  updatedAt: 'actualizadaEn',
};

const Nota = sequelize.define('Nota', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'notas', ...opcionesFechas });

const Consulta = sequelize.define('Consulta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pregunta: { type: DataTypes.TEXT, allowNull: false },
  respuesta: { type: DataTypes.TEXT, allowNull: false },
  inputTokens: { type: DataTypes.INTEGER, allowNull: false },
  outputTokens: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'consultas',
  timestamps: true,
  createdAt: 'creadaEn',
  updatedAt: false,
});

module.exports = { sequelize, Nota, Consulta };
