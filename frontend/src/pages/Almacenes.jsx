import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import { almacenesService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const VACIO = { nombre: '', ubicacion: '', capacidad_total: '', coste_mensual_operacion: '' };

export default function Almacenes() {
  const { hasRole } = useAuth();
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const esAdmin = hasRole('Administrador');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await almacenesService.listar();
      setAlmacenes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setError(''); setModalOpen(true); };
  const abrirEditar = (row) => {
    setForm({
      nombre: row.nombre,
      ubicacion: row.ubicacion || '',
      capacidad_total: row.capacidad_total,
      coste_mensual_operacion: row.coste_mensual_operacion,
    });
    setEditId(row.id);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      capacidad_total: Number(form.capacidad_total),
      coste_mensual_operacion: Number(form.coste_mensual_operacion),
    };
    try {
      if (editId) await almacenesService.actualizar(editId, payload);
      else await almacenesService.crear(payload);
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el almacén');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar el almacén "${row.nombre}"?`)) return;
    try {
      await almacenesService.eliminar(row.id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'capacidad_total', label: 'Capacidad Total' },
    { key: 'coste_mensual_operacion', label: 'Coste Mensual (S/)', render: (r) => Number(r.coste_mensual_operacion).toFixed(2) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Almacenes</h2>
        {esAdmin && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nuevo almacén
          </button>
        )}
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : (
        <Tabla columnas={columnas} datos={almacenes} onEdit={esAdmin ? abrirEditar : undefined} onDelete={esAdmin ? handleDelete : undefined} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar almacén' : 'Nuevo almacén'}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input className="input-field" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input className="input-field" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad total *</label>
              <input type="number" step="0.01" min="0" className="input-field" required value={form.capacidad_total} onChange={(e) => setForm({ ...form, capacidad_total: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste mensual (S/) *</label>
              <input type="number" step="0.01" min="0" className="input-field" required value={form.coste_mensual_operacion} onChange={(e) => setForm({ ...form, coste_mensual_operacion: e.target.value })} />
            </div>
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
