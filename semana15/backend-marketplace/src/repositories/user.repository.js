const User = require('../models/User');
const Role = require('../models/Role');

const withRole = { include: { model: Role, as: 'role' } };

exports.findByEmail = (email) => User.findOne({ where: { email }, ...withRole });

exports.findById = (id) => User.findByPk(id, withRole);

exports.create = (data) => User.create(data);

exports.findOrCreateRole = async (nombre) => {
  const [role] = await Role.findOrCreate({ where: { nombre } });
  return role;
};
