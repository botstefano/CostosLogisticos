import React, { useEffect, useState } from 'react';
import { AlertTriangle, Settings } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import EstadoBadge from '../components/EstadoBadge';
import { alertasService } from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const ESTADOS = ['activa', 'revisada', 'resuelta', 'descartada'];

export default function Alertas() {
  const { hasRole } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  const [configModal, setConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [error, setError] = useState('');

  const puedeGestionar = hasRole('Administrador', 'Supervisor', 'Gerente');
  const puedeConfigurar = hasRole('Administrador', 'Gerente');

  const cargar = async () => {
    setLoading(true);
    try {
      const promises = [alertasService.listar(filtroEstado)];
      if (puedeConfigurar) promises.push(alertasService.configuracion());
      const results = await Promise.all(promises);
      setAlertas(results[0].data);
      if (results[1]) setConfig(results[1].data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroEstado]);

  const cambiarEstado = async (alerta, nuevoEstado) => {
    try {
      await alertasService.actualizarEstado(alerta.id, nuevoEstado);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar la alerta');
    }
  };

  const abrirConfig = (item) => {
    setEditingConfig({ ...item });
    setError('');
    setConfigModal(true);
  };

  const guardarConfig = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await alertasService.actualizarConfiguracion(editingConfig.tipo, {
        umbral_porcentaje: Number(editingConfig.umbral_porcentaje),
        monto_presupuestado_mensual: Number(editingConfig.monto_presupuestado_mensual),
      });
      setConfigModal(false);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la configuración');
    }
  };

  const columnas = [
    { key: 'id', label: 'ID' },
    { key: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleString('es-PE') },
    { key: 'tipo', label: 'Tipo' },
    { key: 'operacion_referencia', label: 'Operación' },
    { key: 'monto_esperado', label: 'Esperado (S/)', render: (r) => Number(r.monto_esperado).toFixed(2) },
    { key: 'monto_real', label: 'Real (S/)', render: (r) => Number(r.monto_real).toFixed(2) },
    { key: 'diferencia', label: 'Diferencia (S/)', render: (r) => Number(r.diferencia).toFixed(2) },
    { key: 'porcentaje_exceso', label: '% Exceso', render: (r) => `${Number(r.porcentaje_exceso).toFixed(1)}%` },
    { key: 'estado', label: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      key: 'acciones', label: 'Gestionar', render: (r) => (
        puedeGestionar ? (
          <select
            className="input-field text-xs py-1"
            value={r.estado}
            onChange={(e) => cambiarEstado(r, e.target.value)}
          >
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        ) : '-'
      ),
    },
  ];

  const columnasConfig = [
    { key: 'tipo', label: 'Tipo de operación' },
    { key: 'umbral_porcentaje', label: 'Umbral (%)', render: (r) => `${Number(r.umbral_porcentaje).toFixed(2)}%` },
    { key: 'monto_presupuestado_mensual', label: 'Presupuesto mensual (S/)', render: (r) => Number(r.monto_presupuestado_mensual).toFixed(2) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle size={22} className="text-red-500" /> Alertas de Sobrecostes
        </h2>
        <select className="input-field w-auto" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={alertas} emptyMessage="No hay alertas registradas" />}

      {puedeConfigurar && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings size={18} /> Configuración de umbrales (RF12)
          </h3>
          <Tabla columnas={columnasConfig} datos={config} onEdit={abrirConfig} />
        </div>
      )}

      <Modal open={configModal} onClose={() => setConfigModal(false)} title={`Configurar umbral: ${editingConfig?.tipo}`}>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        {editingConfig && (
          <form onSubmit={guardarConfig} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Umbral de exceso permitido (%)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={editingConfig.umbral_porcentaje} onChange={(e) => setEditingConfig({ ...editingConfig, umbral_porcentaje: e.target.value })} />
              <p className="text-xs text-gray-400 mt-1">Si el coste real supera el presupuesto + este % se genera una alerta.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto mensual (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={editingConfig.monto_presupuestado_mensual} onChange={(e) => setEditingConfig({ ...editingConfig, monto_presupuestado_mensual: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setConfigModal(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">Guardar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
