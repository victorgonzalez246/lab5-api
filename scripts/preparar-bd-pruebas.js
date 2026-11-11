// Selecciona una base SQLite aislada para cada archivo de pruebas.
module.exports = function prepararBD(nombre) {
  process.env.DATABASE_URL = `file:./test-${nombre}.db`;
};
