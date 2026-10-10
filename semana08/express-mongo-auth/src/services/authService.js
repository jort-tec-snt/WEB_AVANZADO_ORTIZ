import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

const httpError = (status, message) => Object.assign(new Error(message), { status });

const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export const authService = {
  async register({ name, email, password, role }) {
    if (!name || !email || !password) throw httpError(400, 'name, email y password son obligatorios');
    if (await userRepository.findByEmail(email.toLowerCase())) throw httpError(409, 'El email ya está registrado');

    const hashed = await bcrypt.hash(password, 10); // 10 salt rounds
    // OJO (solo laboratorio): permitir 'role' en el body facilita probar rutas de admin.
    // En producción real el rol admin se asignaría desde un proceso interno, no desde el registro público.
    const user = await userRepository.create({ name, email, password: hashed, role });
    return { user: publicUser(user), token: signToken(user) };
  },

  async login({ email, password }) {
    if (!email || !password) throw httpError(400, 'email y password son obligatorios');
    const user = await userRepository.findByEmailWithPassword(email.toLowerCase());
    // Mismo mensaje para "no existe" y "clave incorrecta": no revela qué emails existen
    if (!user || !(await bcrypt.compare(password, user.password))) throw httpError(401, 'Credenciales inválidas');
    return { user: publicUser(user), token: signToken(user) };
  },

  async profile(id) {
    const user = await userRepository.getById(id);
    if (!user) throw httpError(404, 'Usuario no encontrado');
    return publicUser(user);
  }
};
