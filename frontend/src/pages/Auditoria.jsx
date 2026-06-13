import React, { useEffect, useState } from 'react';
import Tabla from '../components/Tabla';
import { auditoriaService } from '../services/endpoints';

const TABLAS = [
  'usuarios', 'proveedores', 'productos', 'almacenes', 'vehiculos',
  'ordenes_compra', 'costes_almacenamiento', 'costes_transporte',
  'distribuciones', 'alertas_sobrecostes', 'inventarios', 'configuracion_alertas',
];

export default function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTabla, setFiltroTabla] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await auditoriaService.listar(filtroTabla ? { tabla: filtroTabla } : {});
      setRegistros(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroTabla]);

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'fecha_cambio', label: 'Fecha', render: (r) => new Date(r.fecha_cambio).toLocaleString('es-PE') },
    { key: 'usuario_nombre', label: 'Usuario', render: (r) => r.usuario_nombre || 'Sistema' },
    { key: 'accion', label: 'Acción' },
    { key: 'tabla_afectada', label: 'Tabla' },
    { key: 'registro_id', label: 'Registro ID' },
    {
      key: 'detalle', label: 'Detalle', render: (r) => (
        <details className="text-xs">
          <summary className="cursor-pointer text-primary-700">Ver cambios</summary>
          <div className="mt-1 grid grid-cols-2 gap-2 max-w-md">
            <div>
              <p className="font-medium text-gray-500">Antes:</p>
              <pre className="bg-gray-50 p-1 rounded overflow-x-auto">{JSON.stringify(r.datos_anteriores_json, null, 1) || '-'}</pre>
            </div>
            <div>
              <p className="font-medium text-gray-500">Después:</p>
              <pre className="bg-gray-50 p-1 rounded overflow-x-auto">{JSON.stringify(r.datos_nuevos_json, null, 1) || '-'}</pre>
            </div>
          </div>
        </details>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Auditoría de Cambios</h2>
        <select className="input-field w-auto" value={filtroTabla} onChange={(e) => setFiltroTabla(e.target.value)}>
          <option value="">Todas las tablas</option>
          {TABLAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={registros} />}
    </div>
  );
}
