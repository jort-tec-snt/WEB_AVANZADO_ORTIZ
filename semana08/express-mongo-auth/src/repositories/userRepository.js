import User from '../models/User.js';

export const userRepository = {
  getAll: () => User.find(),
  getById: (id) => User.findById(id),
  findByEmail: (email) => User.findOne({ email }),
  // Solo para login: trae también el hash (select:false en el schema)
  findByEmailWithPassword: (email) => User.findOne({ email }).select('+password'),
  create: (data) => User.create(data),
  update: (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  remove: (id) => User.findByIdAndDelete(id)
};
