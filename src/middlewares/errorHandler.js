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

  console.error(err);
  res.status(500).json({ error: 'Error interno' });
};
