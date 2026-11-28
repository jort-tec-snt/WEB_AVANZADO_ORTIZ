const cors = require('cors');
require('dotenv').config();

// Orígenes autorizados, separados por comas. En producción es el dominio del
// frontend desplegado; sin la variable no se autoriza ningún origen.
const defaultOrigins = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins)
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Las peticiones sin cabecera Origin (renderizado en el servidor de Next.js, curl
// o la barra de direcciones) no son de origen cruzado y CORS no las regula.
const blockUnknownOrigins = (req, res, next) => {
  const { origin } = req.headers;

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido por CORS',
      data: null
    });
  }

  next();
};

module.exports = [blockUnknownOrigins, cors({ origin: allowedOrigins })];
