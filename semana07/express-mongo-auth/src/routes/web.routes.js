import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/signIn');
});

router.get('/signIn', (req, res) => {
  res.render('auth/signin', { title: 'Iniciar sesión' });
});

router.get('/signUp', (req, res) => {
  res.render('auth/signup', { title: 'Crear cuenta' });
});

router.get('/user/dashboard', (req, res) => {
  res.render('user/dashboard', { title: 'Mi cuenta' });
});

router.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', { title: 'Administración' });
});

router.get('/profile', (req, res) => {
  res.render('user/profile', { title: 'Mi perfil' });
});

router.get('/403', (req, res) => {
  res.status(403).render('errors/403', { title: 'Acceso denegado' });
});

export default router;
