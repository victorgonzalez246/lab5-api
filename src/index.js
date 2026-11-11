require('dotenv').config();
const app = require('./app');
const notas = require('./services/notas.service');

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('Aviso: falta ANTHROPIC_API_KEY en .env; los endpoints de IA responderán 502.');
}

// Las notas viven en memoria y se pierden en cada reinicio: se cargan dos de
// ejemplo para que /api/notas/1 y /api/notas/2 existan desde el arranque.
notas.crear({
  titulo: 'Apuntes de REST',
  contenido:
    'REST es un estilo de arquitectura para construir APIs sobre HTTP. Cada recurso se identifica con una URL y se manipula con los verbos GET, POST, PUT y DELETE. El servidor no guarda estado entre peticiones: cada una lleva todo lo necesario para procesarse. Las respuestas usan códigos de estado como 200, 201, 404 o 500 para indicar el resultado, y normalmente viajan en formato JSON.',
});
notas.crear({
  titulo: 'Pendientes',
  contenido: 'Terminar el laboratorio 5 y subir las capturas al repositorio.',
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`API en http://localhost:${PORT}/api-docs`));
