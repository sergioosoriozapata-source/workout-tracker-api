// EV09 Paso 5 — Cabeceras HTTP: contexto de seguridad y control de datos.
// - Lee cabeceras estándar con req.get(): Content-Type, Authorization.
// - Fija cabeceras de respuesta con res.set().
// - Demuestra cabecera personalizada X-API-Key / X-API-Version.

function headersContext(req, res, next) {
  const contentType = req.get('Content-Type') || 'no-especificado';
  const authorization = req.get('Authorization') || 'no-provisto';
  const apiKey = req.get('X-API-Key') || '';

  // Cabeceras de respuesta estándar + personalizadas (EV09 Paso 5)
  res.set('X-API-Version', 'v1');
  res.set('X-Powered-By', 'workout-tracker-api');
  res.set('X-API-Key-Received', apiKey ? 'true' : 'false');

  // Se adjunta contexto útil para los routers / sustentación (sin bloquear).
  req.headersContext = { contentType, authorization, hasApiKey: Boolean(apiKey) };
  next();
}

module.exports = headersContext;
