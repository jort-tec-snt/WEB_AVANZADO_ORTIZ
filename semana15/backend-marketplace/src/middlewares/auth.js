const authService = require('../services/auth.service');
const HttpError = require('../shared/http-error');

exports.authenticate = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Inicia sesión para continuar');
  }

  req.user = await authService.getUserFromToken(token);
  next();
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new HttpError(403, 'No tienes permiso para esta acción');
  }
  next();
};
