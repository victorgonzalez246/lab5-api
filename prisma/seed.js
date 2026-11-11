// Carga dos notas de ejemplo si la tabla está vacía. Uso: npm run seed
require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.nota.count()) > 0) {
    console.log('La base ya tiene notas; no se agrega nada.');
    return;
  }
  await prisma.nota.create({
    data: {
      titulo: 'Apuntes de REST',
      contenido:
        'REST es un estilo de arquitectura para construir APIs sobre HTTP. Cada recurso se identifica con una URL y se manipula con los verbos GET, POST, PUT y DELETE. El servidor no guarda estado entre peticiones: cada una lleva todo lo necesario para procesarse. Las respuestas usan códigos de estado como 200, 201, 404 o 500 para indicar el resultado, y normalmente viajan en formato JSON.',
    },
  });
  await prisma.nota.create({
    data: {
      titulo: 'Pendientes',
      contenido: 'Terminar el laboratorio 5 y subir las capturas al repositorio.',
    },
  });
  console.log('Se cargaron 2 notas de ejemplo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
