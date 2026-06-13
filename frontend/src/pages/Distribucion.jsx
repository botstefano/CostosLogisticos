import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import EstadoBadge from '../components/EstadoBadge';
import { distribucionesService, comprasService, vehiculosService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const ESTADOS = ['pendiente', 'en almacen', 'en transito', 'entregado', 'cancelado'];

export default function Distribucion() {
  const { hasRole } = useAuth();
  const [distribuciones, setDistribuciones] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ orden_compra_id: '', vehiculo_id: '', fecha_salida: '', fecha_entrega: '', coste_total_transporte: '' });
  const [error, setError] = useState('');

  const puedeCrear = hasRole('Administrador', 'Operador Logistico');
  const puedeGestionar = hasRole('Administrador', 'Operador Logistico', 'Supervisor');

  const cargar = async () => {
    setLoading(true);
    try {
      const [distRes, ordRes, vehRes] = await Promise.all([
        distribucionesService.listar(), comprasService.listar(), vehiculosService.listar(),
      ]);
      setDistribuciones(distRes.data);
      setOrdenes(ordRes.data.filter((o) => o.estado === 'en almacen' || o.estado === 'en transito'));
      setVehiculos(vehRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setForm({ orden_compra_id: '', vehiculo_id: '', fecha_salida: '', fecha_entrega: '', coste_total_transporte: '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await distribucionesService.crear({
        orden_compra_id: form.orden_compra_id ? Number(form.orden_compra_id) : null,
        vehiculo_id: form.vehiculo_id ? Number(form.vehiculo_id) : null,
        fecha_salida: form.fecha_salida || null,
        fecha_entrega: form.fecha_entrega || null,
        coste_total_transporte: form.coste_total_transporte ? Number(form.coste_total_transporte) : 0,
      });
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la distribución');
    }
  };

  const cambiarEstado = async (dist, estado) => {
    try {
      const extra = {};
      if (estado === 'en transito' && !dist.fecha_salida) extra.fecha_salida = new Date().toISOString();
      if (estado === 'entregado' && !dist.fecha_entrega) extra.fecha_entrega = new Date().toISOString();
      await distribucionesService.actualizarEstado(dist.id, { estado, ...extra });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el estado');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'orden_compra_id', label: 'Orden de Compra', render: (r) => r.orden_compra_id ? `OC-${r.orden_compra_id}` : '-' },
    { key: 'placa', label: 'Vehículo' },
    { key: 'fecha_salida', label: 'Salida', render: (r) => r.fecha_salida ? new Date(r.fecha_salida).toLocaleString('es-PE') : '-' },
    { key: 'fecha_entrega', label: 'Entrega', render: (r) => r.fecha_entrega ? new Date(r.fecha_entrega).toLocaleString('es-PE') : '-' },
    { key: 'coste_total_transporte', label: 'Coste (S/)', render: (r) => Number(r.coste_total_transporte).toFixed(2) },
    { key: 'estado', label: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      key: 'acciones', label: 'Actualizar estado', render: (r) => (
        puedeGestionar ? (
          <select className="input-field text-xs py-1" value={r.estado} onChange={(e) => cambiarEstado(r, e.target.value)}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        ) : '-'
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Distribución Logística</h2>
        {puedeCrear && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nueva distribución
          </button>
        )}
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={distribuciones} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva distribución">
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orden de compra</label>
            <select className="input-field" value={form.orden_compra_id} onChange={(e) => setForm({ ...form, orden_compra_id: e.target.value })}>
              <option value="">-- Sin asociar --</option>
              {ordenes.map((o) => <option key={o.id} value={o.id}>OC-{o.id} ({o.proveedor_nombre}) - S/ {Number(o.total).toFixed(2)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
            <select className="input-field" value={form.vehiculo_id} onChange={(e) => setForm({ ...form, vehiculo_id: e.target.value })}>
              <option value="">-- Sin asignar --</option>
              {vehiculos.filter((v) => v.estado === 'disponible').map((v) => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha salida</label>
              <input type="datetime-local" className="input-field" value={form.fecha_salida} onChange={(e) => setForm({ ...form, fecha_salida: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha entrega (estimada)</label>
              <input type="datetime-local" className="input-field" value={form.fecha_entrega} onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coste total de transporte (S/)</label>
            <input type="number" step="0.01" min="0" className="input-field" value={form.coste_total_transporte} onChange={(e) => setForm({ ...form, coste_total_transporte: e.target.value })} />
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
