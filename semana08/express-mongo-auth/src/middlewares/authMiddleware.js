import jwt from 'jsonwebtoken';

// Verifica "Authorization: Bearer <token>" y deja el usuario en req.user
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token requerido (Authorization: Bearer <token>)' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Autorización por rol: requireRole('admin')
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'No tienes permisos para este recurso' });
  }
  next();
};
