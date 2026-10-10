import { userRepository } from '../repositories/userRepository.js';

export const userService = {
  getAll: () => userRepository.getAll(),
  getById: (id) => userRepository.getById(id),
  update: (id, data) => {
    // Evita cambiar password/role por esta vía
    const { name, email } = data;
    return userRepository.update(id, { name, email });
  },
  remove: (id) => userRepository.remove(id)
};
