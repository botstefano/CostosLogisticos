const AlmacenModel = require('../models/almacenModel');
const crudControllerFactory = require('./crudControllerFactory');

module.exports = crudControllerFactory(AlmacenModel, 'almacenes');
