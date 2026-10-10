import userRepository from '../repositories/UserRepository.js';

class UserService {
  async updateProfile(id, data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      const err = new Error('Datos de perfil inválidos');
      err.status = 400;
      throw err;
    }

    const allowedFields = [
      'name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'address'
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (Object.hasOwn(data, field)) {
        if (typeof data[field] !== 'string') {
          const err = new Error(`El campo ${field} debe ser texto`);
          err.status = 400;
          throw err;
        }
        updates[field] = data[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      const err = new Error('No se enviaron campos de perfil permitidos');
      err.status = 400;
      throw err;
    }

    try {
      const user = await userRepository.updateById(id, updates);
      if (!user) {
        const err = new Error('Usuario no encontrado');
        err.status = 404;
        throw err;
      }
    } catch (err) {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const validationError = new Error('Revisa los datos y la fecha de nacimiento del perfil');
        validationError.status = 400;
        throw validationError;
      }
      throw err;
    }

    return this.getById(id);
  }

  async getAll() {
    const users = await userRepository.getAll();
    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      age: user.age,
      url_profile: user.url_profile,
      address: user.address,
      roles: user.roles.map((role) => role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      age: user.age,
      url_profile: user.url_profile,
      address: user.address,
      roles: user.roles.map((r) => r.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export default new UserService();
