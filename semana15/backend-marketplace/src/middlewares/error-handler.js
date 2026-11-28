// Express 5 envía aquí los errores de los manejadores asíncronos.
module.exports = (error, req, res, next) => {
  const status = error.status || 500;

  if (status >= 500) {
    console.error('Error no controlado:', error);
  }

  res.status(status).json({
    success: false,
    message: status >= 500 ? 'Error interno del servidor' : error.message,
    data: null
  });
};
