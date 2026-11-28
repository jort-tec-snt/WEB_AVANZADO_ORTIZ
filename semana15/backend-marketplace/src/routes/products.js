const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, requireRole } = require('../middlewares/auth');
const ROLES = require('../shared/roles');

// Toda la API de productos exige sesión; escribir es exclusivo de ADMIN.
router.use(authenticate);
const onlyAdmin = requireRole(ROLES.ADMIN);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', onlyAdmin, productController.createProduct);
router.put('/:id', onlyAdmin, productController.updateProduct);
router.delete('/:id', onlyAdmin, productController.deleteProduct);

module.exports = router;
