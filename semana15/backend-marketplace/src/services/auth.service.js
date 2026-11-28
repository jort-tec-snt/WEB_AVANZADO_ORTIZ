const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../repositories/user.repository');
const auth = require('../config/auth');
const ROLES = require('../shared/roles');
const HttpError = require('../shared/http-error');

const SALT_ROUNDS = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Se compara contra este hash cuando el correo no existe, para que el tiempo de
// respuesta no revele qué cuentas están registradas.
const DUMMY_HASH = bcrypt.hashSync('sin-cuenta', SALT_ROUNDS);

// Única forma en que un usuario sale de la API: nunca incluye el hash.
const toPublicUser = (user) => ({
  id: user.id,
  nombre: user.nombre,
  email: user.email,
  role: user.role.nombre
});

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const createUser = async ({ nombre, email, password }, roleName) => {
  const cleanName = typeof nombre === 'string' ? nombre.trim() : '';
  const cleanEmail = normalizeEmail(email);

  if (!cleanName || cleanName.length > 100) {
    throw new HttpError(400, 'El nombre es requerido (máximo 100 caracteres)');
  }
  if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 150) {
    throw new HttpError(400, 'El correo no es válido');
  }
  // bcrypt solo usa los primeros 72 bytes.
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
    throw new HttpError(400, 'La contraseña debe tener entre 8 y 72 caracteres');
  }
  if (await users.findByEmail(cleanEmail)) {
    throw new HttpError(409, 'El correo ya está registrado');
  }

  const role = await users.findOrCreateRole(roleName);

  try {
    const created = await users.create({
      nombre: cleanName,
      email: cleanEmail,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
      roleId: role.id
    });
    return toPublicUser(await users.findById(created.id));
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new HttpError(409, 'El correo ya está registrado');
    }
    throw error;
  }
};

const signToken = (user) =>
  jwt.sign({ role: user.role }, auth.secret, {
    subject: String(user.id),
    expiresIn: auth.expiresIn,
    algorithm: auth.algorithm
  });

// El registro público siempre crea clientes: el rol no se lee de la petición.
exports.register = async (data) => {
  const user = await createUser(data, ROLES.CUSTOMER);
  return { user, token: signToken(user) };
};

exports.login = async ({ email, password }) => {
  const found = await users.findByEmail(normalizeEmail(email));
  const matches = await bcrypt.compare(String(password ?? ''), found?.passwordHash ?? DUMMY_HASH);

  if (!found || !matches) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }

  const user = toPublicUser(found);
  return { user, token: signToken(user) };
};

// El rol se lee de la base en cada petición, así un cambio aplica de inmediato.
exports.getUserFromToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, auth.secret, { algorithms: [auth.algorithm] });
  } catch {
    throw new HttpError(401, 'Sesión inválida o expirada');
  }

  const user = await users.findById(payload.sub);
  if (!user) {
    throw new HttpError(401, 'Sesión inválida o expirada');
  }
  return toPublicUser(user);
};

exports.createUser = createUser;
