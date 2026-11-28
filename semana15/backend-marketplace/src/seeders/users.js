// Crea los roles y las cuentas iniciales (la única forma de obtener un ADMIN).
// Las credenciales se leen de .env.seed, que no se versiona.
require('dotenv').config({ path: ['.env.seed', '.env'], quiet: true });

const sequelize = require('../config/database');
const authService = require('../services/auth.service');
const users = require('../repositories/user.repository');
const ROLES = require('../shared/roles');

const seed = async () => {
  await sequelize.sync();

  for (const roleName of Object.values(ROLES)) {
    await users.findOrCreateRole(roleName);

    const email = process.env[`SEED_${roleName}_EMAIL`];
    const password = process.env[`SEED_${roleName}_PASSWORD`];

    if (!email || !password) {
      console.log(`${roleName}: sin SEED_${roleName}_EMAIL/PASSWORD, se omite la cuenta`);
      continue;
    }
    if (await users.findByEmail(email.trim().toLowerCase())) {
      console.log(`${roleName}: la cuenta ya existe`);
      continue;
    }

    await authService.createUser({ nombre: `Usuario ${roleName}`, email, password }, roleName);
    console.log(`${roleName}: cuenta creada`);
  }
};

seed()
  .catch((error) => {
    console.error('No se pudo sembrar usuarios:', error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
