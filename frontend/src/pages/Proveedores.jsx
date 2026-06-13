import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import { proveedoresService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const VACIO = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };

export default function Proveedores() {
  const { hasRole } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const puedeEscribir = hasRole('Administrador', 'Operador Logistico');
  const puedeEliminar = hasRole('Administrador');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await proveedoresService.listar();
      setProveedores(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setError(''); setModalOpen(true); };
  const abrirEditar = (row) => {
    setForm({ nombre: row.nombre, contacto: row.contacto || '', telefono: row.telefono || '', email: row.email || '', direccion: row.direccion || '' });
    setEditId(row.id);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await proveedoresService.actualizar(editId, form);
      } else {
        await proveedoresService.crear(form);
      }
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el proveedor');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar al proveedor "${row.nombre}"?`)) return;
    try {
      await proveedoresService.eliminar(row.id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'activo', label: 'Activo', render: (r) => (r.activo ? 'Sí' : 'No') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
        {puedeEscribir && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nuevo proveedor
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <Tabla
          columnas={columnas}
          datos={proveedores}
          onEdit={puedeEscribir ? abrirEditar : undefined}
          onDelete={puedeEliminar ? handleDelete : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar proveedor' : 'Nuevo proveedor'}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input className="input-field" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
            <input className="input-field" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input className="input-field" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea className="input-field" rows={2} value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
