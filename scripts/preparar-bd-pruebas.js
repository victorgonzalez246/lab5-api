// Crea una base SQLite vacía para un archivo de pruebas y le aplica las migraciones.
// Hay que llamarla antes de cargar la aplicación.
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');

module.exports = function prepararBD(nombre) {
  const archivo = path.join(raiz, 'prisma', `test-${nombre}.db`);
  for (const f of [archivo, `${archivo}-journal`]) fs.rmSync(f, { force: true });

  process.env.DATABASE_URL = `file:./test-${nombre}.db`;
  execSync('npx prisma migrate deploy', { cwd: raiz, env: process.env, stdio: 'pipe' });
};
