const { rateLimit } = require('express-rate-limit');

// Limita las rutas que llaman a Claude para que nadie agote los créditos.
// Se crea con una función para que cada router tenga su propio contador.
module.exports = () =>
  rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.IA_LIMITE_POR_MINUTO) || 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'DEMASIADAS_PETICIONES' },
  });
