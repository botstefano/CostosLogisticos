import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import { inventarioService, productosService, almacenesService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

export default function Inventario() {
  const { hasRole } = useAuth();
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ producto_id: '', almacen_id: '', delta: '', ubicacion_estanteria: '', motivo: '' });
  const [error, setError] = useState('');
  const [filtroAlmacen, setFiltroAlmacen] = useState('');

  const puedeAjustar = hasRole('Administrador', 'Operador Logistico', 'Supervisor');

  const cargar = async () => {
    setLoading(true);
    try {
      const [invRes, prodRes, almRes] = await Promise.all([
        inventarioService.listar(filtroAlmacen ? { almacen_id: filtroAlmacen } : {}),
        productosService.listar(),
        almacenesService.listar(),
      ]);
      setInventario(invRes.data);
      setProductos(prodRes.data);
      setAlmacenes(almRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroAlmacen]);

  const abrirAjuste = () => {
    setForm({ producto_id: '', almacen_id: '', delta: '', ubicacion_estanteria: '', motivo: '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await inventarioService.ajustar({
        ...form,
        producto_id: Number(form.producto_id),
        almacen_id: Number(form.almacen_id),
        delta: Number(form.delta),
      });
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el ajuste');
    }
  };

  const columnas = [
    { key: 'producto_nombre', label: 'Producto' },
    { key: 'almacen_nombre', label: 'Almacén' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'ubicacion_estanteria', label: 'Ubicación' },
    { key: 'ultima_actualizacion', label: 'Última actualización', render: (r) => r.ultima_actualizacion ? new Date(r.ultima_actualizacion).toLocaleString('es-PE') : '-' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Inventario</h2>
        <div className="flex gap-2">
          <select className="input-field w-auto" value={filtroAlmacen} onChange={(e) => setFiltroAlmacen(e.target.value)}>
            <option value="">Todos los almacenes</option>
            {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          {puedeAjustar && (
            <button onClick={abrirAjuste} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Ajuste manual
            </button>
          )}
        </div>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={inventario} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajuste manual de inventario">
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
            <select className="input-field" required value={form.producto_id} onChange={(e) => setForm({ ...form, producto_id: e.target.value })}>
              <option value="">-- Seleccione --</option>
              {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Almacén *</label>
            <select className="input-field" required value={form.almacen_id} onChange={(e) => setForm({ ...form, almacen_id: e.target.value })}>
              <option value="">-- Seleccione --</option>
              {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad (+/-) *</label>
              <input type="number" className="input-field" required value={form.delta} onChange={(e) => setForm({ ...form, delta: e.target.value })} placeholder="Ej: 10 o -5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación estantería</label>
              <input className="input-field" value={form.ubicacion_estanteria} onChange={(e) => setForm({ ...form, ubicacion_estanteria: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input className="input-field" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} placeholder="Ej: Corrección de inventario" />
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
