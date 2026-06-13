const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuarioModel');
const RolModel = require('../models/rolModel');
const { asyncHandler } = require('../middleware/validation');
const { registrarAuditoria } = require('../middleware/audit');

const listar = asyncHandler(async (req, res) => {
  const usuarios = await UsuarioModel.findAll();
  res.json(usuarios);
});

const obtener = asyncHandler(async (req, res) => {
  const usuario = await UsuarioModel.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

const crear = asyncHandler(async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  const existente = await UsuarioModel.findByEmail(email);
  if (existente) return res.status(409).json({ error: 'El email ya está registrado' });

  const password_hash = await bcrypt.hash(password, 10);
  const usuario = await UsuarioModel.create({ nombre, email, password_hash, rol_id });

  await registrarAuditoria(req, 'INSERT', 'usuarios', usuario.id, null, usuario);
  res.status(201).json(usuario);
});

const actualizar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const anterior = await UsuarioModel.findById(id);
  if (!anterior) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { nombre, email, rol_id, activo } = req.body;
  const actualizado = await UsuarioModel.update(id, { nombre, email, rol_id, activo });

  await registrarAuditoria(req, 'UPDATE', 'usuarios', id, anterior, actualizado);
  res.json(actualizado);
});

const eliminar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const anterior = await UsuarioModel.findById(id);
  if (!anterior) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'No puede eliminar su propio usuario' });
  }

  await UsuarioModel.delete(id);
  await registrarAuditoria(req, 'DELETE', 'usuarios', id, anterior, null);
  res.json({ message: 'Usuario eliminado correctamente' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password_nueva } = req.body;

  const usuario = await UsuarioModel.findById(id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const hash = await bcrypt.hash(password_nueva, 10);
  await UsuarioModel.updatePassword(id, hash);

  await registrarAuditoria(req, 'UPDATE', 'usuarios', id, null, { accion: 'reset_password' });
  res.json({ message: 'Contraseña restablecida correctamente' });
});

const listarRoles = asyncHandler(async (req, res) => {
  const roles = await RolModel.findAll();
  res.json(roles);
});

module.exports = { listar, obtener, crear, actualizar, eliminar, resetPassword, listarRoles };
