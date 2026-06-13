import React, { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import EstadoBadge from '../components/EstadoBadge';
import Tabla from '../components/Tabla';
import { trazabilidadService } from '../services/endpoints';

const ESTADOS = ['pendiente', 'en almacen', 'en transito', 'entregado', 'cancelado'];

export default function Trazabilidad() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  const [detalle, setDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [busquedaId, setBusquedaId] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await trazabilidadService.panel(filtroEstado);
      setPedidos(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroEstado]);

  const verDetalle = async (id) => {
    setDetalleLoading(true);
    try {
      const res = await trazabilidadService.ordenDetalle(id);
      setDetalle(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Pedido no encontrado');
    } finally {
      setDetalleLoading(false);
    }
  };

  const columnas = [
    { key: 'id', label: 'OC #', render: (r) => `OC-${r.id}` },
    { key: 'proveedor_nombre', label: 'Proveedor' },
    { key: 'almacen_nombre', label: 'Almacén' },
    { key: 'fecha_emision', label: 'Emisión', render: (r) => new Date(r.fecha_emision).toLocaleDateString('es-PE') },
    { key: 'total', label: 'Total (S/)', render: (r) => Number(r.total).toFixed(2) },
    { key: 'estado', label: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      key: 'detalle', label: 'Detalle', render: (r) => (
        <button onClick={() => verDetalle(r.id)} className="text-primary-700 hover:text-primary-900 flex items-center gap-1 text-xs">
          <MapPin size={14} /> Ver
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Trazabilidad de Pedidos</h2>
        <div className="flex gap-2">
          <div className="flex">
            <input
              className="input-field rounded-r-none"
              placeholder="Buscar por ID de orden..."
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
            />
            <button onClick={() => busquedaId && verDetalle(busquedaId)} className="btn-primary rounded-l-none">
              <Search size={16} />
            </button>
          </div>
          <select className="input-field w-auto" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={pedidos} />}

      {detalleLoading && <p className="text-gray-500">Cargando detalle...</p>}

      {detalle && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Orden de Compra OC-{detalle.orden.id}</h3>
            <EstadoBadge estado={detalle.estado_actual} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Info label="Proveedor" value={detalle.orden.proveedor_nombre} />
            <Info label="Fecha emisión" value={new Date(detalle.orden.fecha_emision).toLocaleDateString('es-PE')} />
            <Info label="Entrega esperada" value={detalle.orden.fecha_entrega_esperada ? new Date(detalle.orden.fecha_entrega_esperada).toLocaleDateString('es-PE') : '-'} />
            <Info label="Total" value={`S/ ${Number(detalle.orden.total).toFixed(2)}`} />
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Línea de tiempo</h4>
            <div className="space-y-2">
              {detalle.timeline.map((ev, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-700 flex-shrink-0" />
                  <span className="text-gray-500 w-40 flex-shrink-0">{new Date(ev.fecha).toLocaleString('es-PE')}</span>
                  <span className="text-gray-700">{ev.evento}</span>
                  <EstadoBadge estado={ev.estado} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Productos</h4>
            <Tabla
              columnas={[
                { key: 'producto_nombre', label: 'Producto' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'precio_unitario', label: 'Precio Unit. (S/)', render: (r) => Number(r.precio_unitario).toFixed(2) },
                { key: 'subtotal', label: 'Subtotal (S/)', render: (r) => Number(r.subtotal).toFixed(2) },
              ]}
              datos={detalle.orden.detalles}
            />
          </div>

          {detalle.costes_asociados.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Costes logísticos asociados</h4>
              <Tabla
                columnas={[
                  { key: 'operacion_referencia', label: 'Operación' },
                  { key: 'tipo_operacion', label: 'Tipo' },
                  { key: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleDateString('es-PE') },
                  { key: 'monto_total', label: 'Monto (S/)', render: (r) => Number(r.monto_total).toFixed(2) },
                ]}
                datos={detalle.costes_asociados}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-md p-2">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
