// Valida req.body contra un esquema de Zod antes de llegar a la ruta.
module.exports = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    return res
      .status(400)
      .json({ error: 'Datos inválidos', errores: r.error.issues });
  }
  req.body = r.data; // datos limpios
  next();
};
