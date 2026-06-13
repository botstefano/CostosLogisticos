import React, { useEffect, useState } from 'react';
import { Plus, KeyRound } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import { usuariosService } from '../services/endpoints';

const VACIO = { nombre: '', email: '', password: '', rol_id: '' };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const [resetModal, setResetModal] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const [usrRes, rolRes] = await Promise.all([usuariosService.listar(), usuariosService.roles()]);
      setUsuarios(usrRes.data);
      setRoles(rolRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setError(''); setModalOpen(true); };
  const abrirEditar = (row) => {
    setForm({ nombre: row.nombre, email: row.email, password: '', rol_id: row.rol_id, activo: row.activo });
    setEditId(row.id);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await usuariosService.actualizar(editId, { nombre: form.nombre, email: form.email, rol_id: Number(form.rol_id), activo: form.activo });
      } else {
        await usuariosService.crear({ ...form, rol_id: Number(form.rol_id) });
      }
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al guardar el usuario');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar al usuario "${row.nombre}"?`)) return;
    try {
      await usuariosService.eliminar(row.id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const abrirReset = (row) => { setResetModal(row); setNuevaPassword(''); };
  const confirmarReset = async () => {
    try {
      await usuariosService.resetPassword(resetModal.id, nuevaPassword);
      setResetModal(null);
      alert('Contraseña restablecida correctamente');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al restablecer la contraseña');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'activo', label: 'Activo', render: (r) => (r.activo ? 'Sí' : 'No') },
    {
      key: 'reset', label: 'Contraseña', render: (r) => (
        <button onClick={() => abrirReset(r)} className="text-primary-700 hover:text-primary-900 flex items-center gap-1 text-xs">
          <KeyRound size={14} /> Restablecer
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Usuarios y Roles</h2>
        <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : (
        <Tabla columnas={columnas} datos={usuarios} onEdit={abrirEditar} onDelete={handleDelete} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar usuario' : 'Nuevo usuario'}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input className="input-field" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" className="input-field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
              <input type="password" className="input-field" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
            <select className="input-field" required value={form.rol_id} onChange={(e) => setForm({ ...form, rol_id: e.target.value })}>
              <option value="">-- Seleccione --</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
          {editId && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="activo" checked={!!form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
              <label htmlFor="activo" className="text-sm text-gray-700">Usuario activo</label>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!resetModal} onClose={() => setResetModal(null)} title={`Restablecer contraseña - ${resetModal?.nombre}`}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña *</label>
            <input type="password" className="input-field" minLength={6} value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setResetModal(null)} className="btn-secondary">Cancelar</button>
            <button onClick={confirmarReset} disabled={nuevaPassword.length < 6} className="btn-primary">Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
