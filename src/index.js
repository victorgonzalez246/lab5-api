require('dotenv').config();
const app = require('./app');

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('Aviso: falta ANTHROPIC_API_KEY en .env; los endpoints de IA responderán 502.');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`API en http://localhost:${PORT}/api-docs`));
