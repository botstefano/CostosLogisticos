import React, { useEffect, useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import { productosService, proveedoresService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const VACIO = { nombre: '', descripcion: '', precio_unitario: '', stock_minimo: '', proveedor_id: '' };

export default function Productos() {
  const { hasRole } = useAuth();
  const [productos, setProductos] = useState([]);
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
      const [prodRes, provRes] = await Promise.all([productosService.listar(), proveedoresService.listar()]);
      setProductos(prodRes.data);
      setProveedores(provRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => { setForm(VACIO); setEditId(null); setError(''); setModalOpen(true); };
  const abrirEditar = (row) => {
    setForm({
      nombre: row.nombre,
      descripcion: row.descripcion || '',
      precio_unitario: row.precio_unitario,
      stock_minimo: row.stock_minimo,
      proveedor_id: row.proveedor_id || '',
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
      precio_unitario: Number(form.precio_unitario),
      stock_minimo: form.stock_minimo === '' ? 0 : Number(form.stock_minimo),
      proveedor_id: form.proveedor_id ? Number(form.proveedor_id) : null,
    };
    try {
      if (editId) {
        await productosService.actualizar(editId, payload);
      } else {
        await productosService.crear(payload);
      }
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar el producto "${row.nombre}"?`)) return;
    try {
      await productosService.eliminar(row.id);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'precio_unitario', label: 'Precio Unit. (S/)', render: (r) => Number(r.precio_unitario).toFixed(2) },
    {
      key: 'stock_actual', label: 'Stock', render: (r) => (
        <span className={r.stock_actual <= r.stock_minimo ? 'text-red-600 font-semibold flex items-center gap-1' : ''}>
          {r.stock_actual <= r.stock_minimo && <AlertCircle size={14} />}
          {r.stock_actual}
        </span>
      ),
    },
    { key: 'stock_minimo', label: 'Stock Mín.' },
    { key: 'proveedor_nombre', label: 'Proveedor' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
        {puedeEscribir && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nuevo producto
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <Tabla
          columnas={columnas}
          datos={productos}
          onEdit={puedeEscribir ? abrirEditar : undefined}
          onDelete={puedeEliminar ? handleDelete : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar producto' : 'Nuevo producto'}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input className="input-field" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea className="input-field" rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio unitario (S/) *</label>
              <input type="number" step="0.01" min="0" className="input-field" required value={form.precio_unitario} onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock mínimo</label>
              <input type="number" min="0" className="input-field" value={form.stock_minimo} onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <select className="input-field" value={form.proveedor_id} onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}>
              <option value="">-- Sin proveedor --</option>
              {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
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
