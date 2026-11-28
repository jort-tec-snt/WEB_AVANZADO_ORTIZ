const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const session = await authService.register(req.body ?? {});
  res.status(201).json({ success: true, message: 'Cuenta creada correctamente', data: session });
};

exports.login = async (req, res) => {
  const session = await authService.login(req.body ?? {});
  res.json({ success: true, message: 'Sesión iniciada', data: session });
};

exports.me = (req, res) => {
  res.json({ success: true, message: 'Sesión activa', data: req.user });
};
