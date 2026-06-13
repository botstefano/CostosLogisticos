const ProductoModel = require('../models/productoModel');
const crudControllerFactory = require('./crudControllerFactory');
const { asyncHandler } = require('../middleware/validation');

const base = crudControllerFactory(ProductoModel, 'productos');

const bajoStock = asyncHandler(async (req, res) => {
  const items = await ProductoModel.findBajoStock();
  res.json(items);
});

module.exports = { ...base, bajoStock };
