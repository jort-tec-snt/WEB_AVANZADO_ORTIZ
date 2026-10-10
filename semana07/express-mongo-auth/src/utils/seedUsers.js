import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

const seedUsers = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;
  const adminLastName = process.env.ADMIN_LAST_NAME;
  const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
  const adminBirthdate = process.env.ADMIN_BIRTHDATE;

  if (
    !adminEmail ||
    !adminPassword ||
    !adminName ||
    !adminLastName ||
    !adminPhoneNumber ||
    !adminBirthdate
  ) {
    console.log('Admin seed omitido: faltan variables de entorno');
    return;
  }

  const existingAdmin = await userRepository.findByEmail(adminEmail);
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  let adminRole = await roleRepository.findByName('admin');
  if (!adminRole) {
    adminRole = await roleRepository.create({ name: 'admin' });
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  await userRepository.create({
    email: adminEmail,
    password: hashedPassword,
    name: adminName,
    lastName: adminLastName,
    phoneNumber: adminPhoneNumber,
    birthdate: new Date(adminBirthdate),
    roles: [adminRole._id]
  });

  console.log('Admin user seeded');
};

export default seedUsers;
