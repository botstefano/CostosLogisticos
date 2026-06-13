const ProveedorModel = require('../models/proveedorModel');
const crudControllerFactory = require('./crudControllerFactory');

module.exports = crudControllerFactory(ProveedorModel, 'proveedores');
