const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      data: null
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Producto obtenido correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      data: null
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos',
        data: null
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0',
        data: null
      });
    }

    const product = await Product.create({ nombre, precio, descripcion });

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      data: null
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    if (precio && precio <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0',
        data: null
      });
    }

    await product.update({ nombre, precio, descripcion });

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      data: null
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Producto eliminado correctamente',
      data: null
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      data: null
    });
  }
};
