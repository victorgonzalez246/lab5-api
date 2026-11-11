// Una sola conexión a la base de datos para toda la aplicación.
const { PrismaClient } = require('@prisma/client');

module.exports = new PrismaClient();
