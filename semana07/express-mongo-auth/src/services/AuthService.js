import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {
  async signUp({ email, password, name, lastName, phoneNumber, birthdate }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('El email ya se encuentra en uso');
      err.status = 400;
      throw err;
    }

    const hasMinLength = password && password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[#$%&*@]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasDigit || !hasSpecialChar) {
      const err = new Error('La contraseña no cumple con los requisitos de seguridad');
      err.status = 400;
      throw err;
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const roles = ['user'];
    const roleDocs = [];
    for (const roleName of roles) {
      let roleDoc = await roleRepository.findByName(roleName);
      if (!roleDoc) {
        roleDoc = await roleRepository.create({ name: roleName });
      }
      roleDocs.push(roleDoc._id);
    }

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      lastName,
      phoneNumber,
      birthdate,
      roles: roleDocs
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name
    };
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        sub: user._id,
        roles: user.roles.map(r => r.name)
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      }
    );

    return {
      token
    };
  }
}

export default new AuthService();
