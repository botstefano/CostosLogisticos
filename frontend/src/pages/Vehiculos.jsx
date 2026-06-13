import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import EstadoBadge from '../components/EstadoBadge';
import { vehiculosService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const VACIO = { placa: '', modelo: '', capacidad_carga: '', coste_por_km: '', estado: 'disponible' };
const ESTADOS = ['disponible', 'en ruta', 'mantenimiento', 'inactivo'];

export default function Vehiculos() {
  const { hasRole } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const puedeEscribir = hasRole('Administrador', 'Operador Logistico');
  const esAdmin = hasRole('Administrador');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await vehiculosService.listar();
      setVehiculos(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setError(''); setModalOpen(true); };
  const abrirEditar = (row) => {
    setForm({ placa: row.placa, modelo: row.modelo || '', capacidad_carga: row.capacidad_carga, coste_por_km: row.coste_por_km, estado: row.estado });
    setEditId(row.id);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, capacidad_carga: Number(form.capacidad_carga), coste_por_km: Number(form.coste_por_km) };
    try {
      if (editId) await vehiculosService.actualizar(editId, payload);
      else await vehiculosService.crear(payload);
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el vehículo');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar el vehículo "${row.placa}"?`)) return;
    try {
      await vehiculosService.eliminar(row.id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'placa', label: 'Placa' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'capacidad_carga', label: 'Capacidad (kg)' },
    { key: 'coste_por_km', label: 'Coste/km (S/)', render: (r) => Number(r.coste_por_km).toFixed(2) },
    { key: 'estado', label: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Vehículos</h2>
        {puedeEscribir && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nuevo vehículo
          </button>
        )}
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : (
        <Tabla columnas={columnas} datos={vehiculos} onEdit={puedeEscribir ? abrirEditar : undefined} onDelete={esAdmin ? handleDelete : undefined} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar vehículo' : 'Nuevo vehículo'}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
              <input className="input-field" required value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select className="input-field" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input className="input-field" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad de carga (kg)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={form.capacidad_carga} onChange={(e) => setForm({ ...form, capacidad_carga: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste por km (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={form.coste_por_km} onChange={(e) => setForm({ ...form, coste_por_km: e.target.value })} />
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
