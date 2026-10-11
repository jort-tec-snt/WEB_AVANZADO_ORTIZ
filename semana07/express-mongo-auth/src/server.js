import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.disable('x-powered-by');
app.set('trust proxy', 1);

// La web se sirve desde el mismo origen: sin CORS salvo que se defina CORS_ORIGIN
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ponytail: límite por IP en memoria; con varias instancias usar un store compartido
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: 'Demasiados intentos, intente más tarde' }
});

app.use('/', webRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true
  });
});

app.use((req, res) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Ruta API no encontrada' });
  }
  return res.status(404).render('errors/404', { title: 'Página no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }
  const status = err.status || 500;
  res.status(status).json({
    message: status >= 500 ? 'Error interno del servidor' : err.message
  });
});

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true
  });
  console.log('Mongo connected');
  await seedRoles();
  await seedUsers();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
} catch (error) {
  console.error('Error de conexión a MongoDB:', error.message);
  process.exit(1);
}
