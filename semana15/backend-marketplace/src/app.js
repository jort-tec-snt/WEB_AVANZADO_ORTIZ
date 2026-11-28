const express = require('express');
const corsPolicy = require('./config/cors');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const errorHandler = require('./middlewares/error-handler');

const app = express();

// Middlewares
app.use(corsPolicy);
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
