const Anthropic = require('@anthropic-ai/sdk');
const { AppError } = require('../utils/errors');

// Manejador central: todas las respuestas de error salen como { error: '...' }.
module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  // JSON mal formado en el body (lo lanza express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  // Errores de la Claude API: el detalle se queda en la consola del servidor
  // y al cliente solo le llega un mensaje genérico.
  if (err instanceof Anthropic.APIError) {
    console.error('Claude API:', err.status, err.message);
    const status = err.status === 429 ? 429
      : err.status === 529 ? 503 : 502;
    return res.status(status).json({ error: 'IA_NO_DISPONIBLE' });
  }

  // Otros fallos del SDK, por ejemplo cuando falta la API key.
  if (err instanceof Anthropic.AnthropicError) {
    console.error('Claude SDK:', err.message);
    return res.status(502).json({ error: 'IA_NO_DISPONIBLE' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno' });
};
