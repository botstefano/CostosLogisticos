import React, { useEffect, useState } from 'react';
import { Plus, Warehouse, Truck } from 'lucide-react';
import Tabla from '../components/Tabla';
import Modal from '../components/Modal';
import {
  costesAlmacenamientoService, costesTransporteService,
  almacenesService, vehiculosService,
} from '../services/endpoints';
import { useAuth } from '../context/AuthContext';

const TIPOS_GASTO = ['alquiler', 'mantenimiento', 'mano_obra', 'servicios', 'otros'];

const ALM_VACIO = { almacen_id: '', fecha: '', concepto: '', monto: '', tipo_gasto: 'alquiler', operacion_referencia: '' };
const TRA_VACIO = {
  vehiculo_id: '', fecha: '', ruta_origen: '', ruta_destino: '', kilometros_recorridos: '',
  coste_combustible: '', coste_peajes: '', coste_mantenimiento: '', coste_conductor: '', operacion_referencia: '',
};

export default function Costes() {
  const { hasRole } = useAuth();
  const [tab, setTab] = useState('almacenamiento');

  const [costesAlm, setCostesAlm] = useState([]);
  const [costesTra, setCostesTra] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalAlmOpen, setModalAlmOpen] = useState(false);
  const [formAlm, setFormAlm] = useState(ALM_VACIO);
  const [errorAlm, setErrorAlm] = useState('');

  const [modalTraOpen, setModalTraOpen] = useState(false);
  const [formTra, setFormTra] = useState(TRA_VACIO);
  const [errorTra, setErrorTra] = useState('');
  const [alertaInfo, setAlertaInfo] = useState(null);

  const puedeEscribir = hasRole('Administrador', 'Operador Logistico');

  const cargar = async () => {
    setLoading(true);
    try {
      const [almRes, traRes, almacenesRes, vehiculosRes] = await Promise.all([
        costesAlmacenamientoService.listar(),
        costesTransporteService.listar(),
        almacenesService.listar(),
        vehiculosService.listar(),
      ]);
      setCostesAlm(almRes.data);
      setCostesTra(traRes.data);
      setAlmacenes(almacenesRes.data);
      setVehiculos(vehiculosRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // --- Costes de almacenamiento ---
  const abrirNuevoAlm = () => { setFormAlm(ALM_VACIO); setErrorAlm(''); setModalAlmOpen(true); };

  const handleSubmitAlm = async (e) => {
    e.preventDefault();
    setErrorAlm('');
    try {
      const res = await costesAlmacenamientoService.crear({
        ...formAlm,
        almacen_id: Number(formAlm.almacen_id),
        monto: Number(formAlm.monto),
        fecha: formAlm.fecha || null,
      });
      setModalAlmOpen(false);
      if (res.data.alerta_generada) mostrarAlerta(res.data.alerta_generada);
      cargar();
    } catch (err) {
      setErrorAlm(err.response?.data?.error || 'Error al registrar el coste de almacenamiento');
    }
  };

  // --- Costes de transporte ---
  const abrirNuevoTra = () => { setFormTra(TRA_VACIO); setErrorTra(''); setModalTraOpen(true); };

  const totalTransporteEstimado = ['coste_combustible', 'coste_peajes', 'coste_mantenimiento', 'coste_conductor']
    .reduce((acc, key) => acc + (Number(formTra[key]) || 0), 0);

  const handleSubmitTra = async (e) => {
    e.preventDefault();
    setErrorTra('');
    try {
      const res = await costesTransporteService.crear({
        ...formTra,
        vehiculo_id: Number(formTra.vehiculo_id),
        kilometros_recorridos: Number(formTra.kilometros_recorridos),
        coste_combustible: Number(formTra.coste_combustible) || 0,
        coste_peajes: Number(formTra.coste_peajes) || 0,
        coste_mantenimiento: Number(formTra.coste_mantenimiento) || 0,
        coste_conductor: Number(formTra.coste_conductor) || 0,
        fecha: formTra.fecha || null,
      });
      setModalTraOpen(false);
      if (res.data.alerta_generada) mostrarAlerta(res.data.alerta_generada);
      cargar();
    } catch (err) {
      setErrorTra(err.response?.data?.error || 'Error al registrar el coste de transporte');
    }
  };

  const mostrarAlerta = (alerta) => {
    setAlertaInfo(alerta);
    setTimeout(() => setAlertaInfo(null), 8000);
  };

  const columnasAlm = [
    { key: 'id', label: 'ID' },
    { key: 'almacen_nombre', label: 'Almacén' },
    { key: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleDateString('es-PE') },
    { key: 'concepto', label: 'Concepto' },
    { key: 'tipo_gasto', label: 'Tipo de gasto' },
    { key: 'monto', label: 'Monto (S/)', render: (r) => Number(r.monto).toFixed(2) },
  ];

  const columnasTra = [
    { key: 'id', label: 'ID' },
    { key: 'placa', label: 'Vehículo' },
    { key: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleDateString('es-PE') },
    { key: 'ruta_origen', label: 'Origen' },
    { key: 'ruta_destino', label: 'Destino' },
    { key: 'kilometros_recorridos', label: 'KM' },
    { key: 'coste_total', label: 'Total (S/)', render: (r) => Number(r.coste_total).toFixed(2) },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Costes Logísticos</h2>

      {alertaInfo && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md px-4 py-3">
          <strong>⚠ Alerta de sobrecoste generada:</strong> El tipo "{alertaInfo.tipo}" superó el presupuesto mensual
          (esperado S/ {Number(alertaInfo.monto_esperado).toFixed(2)}, real S/ {Number(alertaInfo.monto_real).toFixed(2)},
          {' '}{Number(alertaInfo.porcentaje_exceso).toFixed(1)}% de exceso). Revise el panel de Alertas.
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('almacenamiento')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${tab === 'almacenamiento' ? 'border-primary-700 text-primary-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Warehouse size={16} /> Almacenamiento
        </button>
        <button
          onClick={() => setTab('transporte')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${tab === 'transporte' ? 'border-primary-700 text-primary-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Truck size={16} /> Transporte
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : (
        <>
          {tab === 'almacenamiento' && (
            <div className="space-y-3">
              {puedeEscribir && (
                <div className="flex justify-end">
                  <button onClick={abrirNuevoAlm} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> Nuevo coste de almacenamiento
                  </button>
                </div>
              )}
              <Tabla columnas={columnasAlm} datos={costesAlm} />
            </div>
          )}

          {tab === 'transporte' && (
            <div className="space-y-3">
              {puedeEscribir && (
                <div className="flex justify-end">
                  <button onClick={abrirNuevoTra} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> Nuevo coste de transporte
                  </button>
                </div>
              )}
              <Tabla columnas={columnasTra} datos={costesTra} />
            </div>
          )}
        </>
      )}

      {/* Modal Coste Almacenamiento */}
      <Modal open={modalAlmOpen} onClose={() => setModalAlmOpen(false)} title="Nuevo coste de almacenamiento">
        {errorAlm && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{errorAlm}</div>}
        <form onSubmit={handleSubmitAlm} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Almacén *</label>
              <select className="input-field" required value={formAlm.almacen_id} onChange={(e) => setFormAlm({ ...formAlm, almacen_id: e.target.value })}>
                <option value="">-- Seleccione --</option>
                {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" className="input-field" value={formAlm.fecha} onChange={(e) => setFormAlm({ ...formAlm, fecha: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concepto *</label>
            <input className="input-field" required value={formAlm.concepto} onChange={(e) => setFormAlm({ ...formAlm, concepto: e.target.value })} placeholder="Ej: Alquiler mensual, mantenimiento de estanterías..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de gasto *</label>
              <select className="input-field" required value={formAlm.tipo_gasto} onChange={(e) => setFormAlm({ ...formAlm, tipo_gasto: e.target.value })}>
                {TIPOS_GASTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (S/) *</label>
              <input type="number" step="0.01" min="0" className="input-field" required value={formAlm.monto} onChange={(e) => setFormAlm({ ...formAlm, monto: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referencia de operación</label>
            <input className="input-field" value={formAlm.operacion_referencia} onChange={(e) => setFormAlm({ ...formAlm, operacion_referencia: e.target.value })} placeholder="Opcional, ej: OC-12" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalAlmOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* Modal Coste Transporte */}
      <Modal open={modalTraOpen} onClose={() => setModalTraOpen(false)} title="Nuevo coste de transporte">
        {errorTra && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{errorTra}</div>}
        <form onSubmit={handleSubmitTra} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo *</label>
              <select className="input-field" required value={formTra.vehiculo_id} onChange={(e) => setFormTra({ ...formTra, vehiculo_id: e.target.value })}>
                <option value="">-- Seleccione --</option>
                {vehiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} - {v.modelo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" className="input-field" value={formTra.fecha} onChange={(e) => setFormTra({ ...formTra, fecha: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruta origen</label>
              <input className="input-field" value={formTra.ruta_origen} onChange={(e) => setFormTra({ ...formTra, ruta_origen: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruta destino</label>
              <input className="input-field" value={formTra.ruta_destino} onChange={(e) => setFormTra({ ...formTra, ruta_destino: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros recorridos *</label>
            <input type="number" step="0.01" min="0" className="input-field" required value={formTra.kilometros_recorridos} onChange={(e) => setFormTra({ ...formTra, kilometros_recorridos: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste combustible (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={formTra.coste_combustible} onChange={(e) => setFormTra({ ...formTra, coste_combustible: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste peajes (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={formTra.coste_peajes} onChange={(e) => setFormTra({ ...formTra, coste_peajes: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste mantenimiento (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={formTra.coste_mantenimiento} onChange={(e) => setFormTra({ ...formTra, coste_mantenimiento: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coste conductor (S/)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={formTra.coste_conductor} onChange={(e) => setFormTra({ ...formTra, coste_conductor: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referencia de operación</label>
            <input className="input-field" value={formTra.operacion_referencia} onChange={(e) => setFormTra({ ...formTra, operacion_referencia: e.target.value })} placeholder="Opcional" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold text-gray-700">Coste total estimado: S/ {totalTransporteEstimado.toFixed(2)}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setModalTraOpen(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">Guardar</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
