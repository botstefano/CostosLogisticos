const VehiculoModel = require('../models/vehiculoModel');
const crudControllerFactory = require('./crudControllerFactory');

module.exports = crudControllerFactory(VehiculoModel, 'vehiculos');
