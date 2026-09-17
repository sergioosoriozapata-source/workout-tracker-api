// EV09 Paso 3 — Validación de parámetros dinámicos (req.params).
// Reutilizable en los 4 routers: /:id debe ser entero positivo.

function validateIdParam(req, res, next) {
  const { id } = req.params;
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Parámetro :id inválido ("${id}"). Debe ser un entero positivo.`,
    });
  }
  req.validatedId = parsed;
  next();
}

module.exports = validateIdParam;
