// Carga dos notas de ejemplo si la tabla está vacía. Uso: npm run seed
require('dotenv').config({ quiet: true });
const { sequelize, Nota } = require('../src/models');

async function main() {
  await sequelize.sync();
  if ((await Nota.count()) > 0) {
    console.log('La base ya tiene notas; no se agrega nada.');
    return;
  }

  await Nota.bulkCreate([
    {
      titulo: 'Apuntes de REST',
      contenido: 'REST es un estilo de arquitectura para construir APIs sobre HTTP. Cada recurso se identifica con una URL y se manipula con los verbos GET, POST, PUT y DELETE.',
    },
    {
      titulo: 'Pendientes',
      contenido: 'Terminar el laboratorio 5 y subir las capturas al repositorio.',
    },
  ]);
  console.log('Se cargaron 2 notas de ejemplo.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
