import React, { useEffect, useState } from 'react';
import { Plus, PackageCheck, Trash2 } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import EstadoBadge from '../components/EstadoBadge';
import { comprasService, proveedoresService, productosService, almacenesService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const ITEM_VACIO = { producto_id: '', cantidad: '', precio_unitario: '' };

export default function Compras() {
  const { hasRole } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ proveedor_id: '', fecha_entrega_esperada: '', almacen_destino_id: '', items: [{ ...ITEM_VACIO }] });
  const [error, setError] = useState('');

  const [recibirModal, setRecibirModal] = useState(null); // orden seleccionada
  const [almacenRecepcion, setAlmacenRecepcion] = useState('');

  const puedeCrear = hasRole('Administrador', 'Operador Logistico');
  const puedeRecibir = hasRole('Administrador', 'Operador Logistico');

  const cargar = async () => {
    setLoading(true);
    try {
      const [ordRes, provRes, prodRes, almRes] = await Promise.all([
        comprasService.listar(), proveedoresService.listar(), productosService.listar(), almacenesService.listar(),
      ]);
      setOrdenes(ordRes.data);
      setProveedores(provRes.data);
      setProductos(prodRes.data);
      setAlmacenes(almRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirNuevo = () => {
    setForm({ proveedor_id: '', fecha_entrega_esperada: '', almacen_destino_id: '', items: [{ ...ITEM_VACIO }] });
    setError('');
    setModalOpen(true);
  };

  const actualizarItem = (idx, campo, valor) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [campo]: valor };

    // Autocompletar precio unitario al elegir producto
    if (campo === 'producto_id') {
      const prod = productos.find((p) => String(p.id) === String(valor));
      if (prod) items[idx].precio_unitario = prod.precio_unitario;
    }
    setForm({ ...form, items });
  };

  const agregarItem = () => setForm({ ...form, items: [...form.items, { ...ITEM_VACIO }] });
  const quitarItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const totalEstimado = form.items.reduce((acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const items = form.items
      .filter((it) => it.producto_id && it.cantidad)
      .map((it) => ({ producto_id: Number(it.producto_id), cantidad: Number(it.cantidad), precio_unitario: Number(it.precio_unitario) }));

    if (items.length === 0) {
      setError('Debe agregar al menos un producto válido');
      return;
    }

    try {
      await comprasService.crear({
        proveedor_id: Number(form.proveedor_id),
        fecha_entrega_esperada: form.fecha_entrega_esperada || null,
        almacen_destino_id: form.almacen_destino_id ? Number(form.almacen_destino_id) : null,
        items,
      });
      setModalOpen(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la orden de compra');
    }
  };

  const abrirRecepcion = (orden) => {
    setRecibirModal(orden);
    setAlmacenRecepcion(orden.almacen_destino_id || '');
  };

  const confirmarRecepcion = async () => {
    try {
      await comprasService.recibir(recibirModal.id, almacenRecepcion ? Number(almacenRecepcion) : undefined);
      setRecibirModal(null);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al recibir la mercancía');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'proveedor_nombre', label: 'Proveedor' },
    { key: 'fecha_emision', label: 'Emisión', render: (r) => r.fecha_emision ? new Date(r.fecha_emision).toLocaleDateString('es-PE') : '-' },
    { key: 'fecha_entrega_esperada', label: 'Entrega esperada', render: (r) => r.fecha_entrega_esperada ? new Date(r.fecha_entrega_esperada).toLocaleDateString('es-PE') : '-' },
    { key: 'total', label: 'Total (S/)', render: (r) => Number(r.total).toFixed(2) },
    { key: 'estado', label: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      key: 'acciones_recepcion', label: 'Recepción', render: (r) => (
        puedeRecibir && r.estado === 'pendiente' ? (
          <button onClick={() => abrirRecepcion(r)} className="text-primary-700 hover:text-primary-900 flex items-center gap-1 text-xs">
            <PackageCheck size={14} /> Recibir
          </button>
        ) : '-'
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Órdenes de Compra</h2>
        {puedeCrear && (
          <button onClick={abrirNuevo} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Nueva orden
          </button>
        )}
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={ordenes} />}

      {/* Modal Nueva Orden */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva orden de compra">
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
              <select className="input-field" required value={form.proveedor_id} onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}>
                <option value="">-- Seleccione --</option>
                {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha entrega esperada</label>
              <input type="date" className="input-field" value={form.fecha_entrega_esperada} onChange={(e) => setForm({ ...form, fecha_entrega_esperada: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Almacén destino</label>
            <select className="input-field" value={form.almacen_destino_id} onChange={(e) => setForm({ ...form, almacen_destino_id: e.target.value })}>
              <option value="">-- Seleccione --</option>
              {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>

          <div className="border-t pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Productos *</label>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select className="input-field col-span-5" required value={item.producto_id} onChange={(e) => actualizarItem(idx, 'producto_id', e.target.value)}>
                    <option value="">-- Producto --</option>
                    {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <input type="number" min="1" placeholder="Cant." required className="input-field col-span-2" value={item.cantidad} onChange={(e) => actualizarItem(idx, 'cantidad', e.target.value)} />
                  <input type="number" step="0.01" min="0" placeholder="Precio" required className="input-field col-span-3" value={item.precio_unitario} onChange={(e) => actualizarItem(idx, 'precio_unitario', e.target.value)} />
                  <span className="col-span-1 text-xs text-gray-500 text-right">
                    {((Number(item.cantidad) || 0) * (Number(item.precio_unitario) || 0)).toFixed(2)}
                  </span>
                  <button type="button" onClick={() => quitarItem(idx)} className="col-span-1 text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={agregarItem} className="text-primary-700 text-sm font-medium mt-2 flex items-center gap-1">
              <Plus size={14} /> Agregar producto
            </button>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold text-gray-700">Total estimado: S/ {totalEstimado.toFixed(2)}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">Registrar orden</button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Recepción de mercancía */}
      <Modal open={!!recibirModal} onClose={() => setRecibirModal(null)} title={`Recibir mercancía - Orden #${recibirModal?.id}`}>
        <p className="text-sm text-gray-600 mb-3">
          Esta acción actualizará automáticamente el inventario y marcará la orden como <strong>"en almacen"</strong>.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Almacén de recepción *</label>
          <select className="input-field" value={almacenRecepcion} onChange={(e) => setAlmacenRecepcion(e.target.value)}>
            <option value="">-- Seleccione --</option>
            {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={() => setRecibirModal(null)} className="btn-secondary">Cancelar</button>
          <button onClick={confirmarRecepcion} disabled={!almacenRecepcion} className="btn-primary">Confirmar recepción</button>
        </div>
      </Modal>
    </div>
  );
}
