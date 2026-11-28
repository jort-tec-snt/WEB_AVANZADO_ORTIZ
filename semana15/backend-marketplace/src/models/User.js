const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role');

const User = sequelize.define('User', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING(60),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [{ name: 'users_email_unique', unique: true, fields: ['email'] }]
});

Role.hasMany(User, { foreignKey: { name: 'roleId', allowNull: false } });
User.belongsTo(Role, { as: 'role', foreignKey: { name: 'roleId', allowNull: false } });

module.exports = User;
