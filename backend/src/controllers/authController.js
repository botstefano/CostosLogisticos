const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');
const { asyncHandler } = require('../middleware/validation');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const usuario = await UsuarioModel.findByEmail(email);
  if (!usuario || !usuario.activo) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol_id: usuario.rol_id,
    rol: usuario.rol,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  res.json({ token, usuario: payload });
});

const me = asyncHandler(async (req, res) => {
  const usuario = await UsuarioModel.findById(req.user.id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

const cambiarPassword = asyncHandler(async (req, res) => {
  const { password_actual, password_nueva } = req.body;

  const usuario = await UsuarioModel.findByEmail(req.user.email);
  const ok = await bcrypt.compare(password_actual, usuario.password_hash);
  if (!ok) return res.status(400).json({ error: 'La contraseña actual no es correcta' });

  const hash = await bcrypt.hash(password_nueva, 10);
  await UsuarioModel.updatePassword(req.user.id, hash);

  res.json({ message: 'Contraseña actualizada correctamente' });
});

module.exports = { login, me, cambiarPassword };
