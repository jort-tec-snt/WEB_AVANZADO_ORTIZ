const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false,
  // Índice con nombre para que sync({ alter: true }) no lo duplique.
  indexes: [{ name: 'roles_nombre_unique', unique: true, fields: ['nombre'] }]
});

module.exports = Role;
