const crypto = require('crypto');
require('dotenv').config();

let secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción (mínimo 32 caracteres)');
  }
  // En desarrollo se genera uno temporal: las sesiones caducan al reiniciar.
  secret = crypto.randomBytes(48).toString('hex');
  console.warn('JWT_SECRET no definido: se usa una clave temporal de desarrollo');
}

module.exports = {
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  algorithm: 'HS256'
};
