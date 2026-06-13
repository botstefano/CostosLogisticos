import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, Truck, DollarSign } from 'lucide-react';
import { costesTotalesService } from '../services/endpoints';
import EstadoBadge from '../components/EstadoBadge';

const COLORS = ['#1e3a8a', '#2563eb', '#60a5fa', '#93c5fd', '#94a3b8'];

const TIPO_LABELS = {
  compra: 'Compras',
  almacenamiento: 'Almacenamiento',
  transporte: 'Transporte',
  distribucion: 'Distribución',
  general: 'General',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    costesTotalesService.dashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar el dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando dashboard...</p>;
  if (error) return <div className="bg-red-50 text-red-700 text-sm rounded-md px-4 py-3">{error}</div>;
  if (!data) return null;

  const desgloseData = Object.entries(data.desglose_por_tipo)
    .filter(([, value]) => value > 0)
    .map(([tipo, value]) => ({ name: TIPO_LABELS[tipo] || tipo, value }));

  const comparativaData = [
    { name: 'Real', monto: data.comparativa_real_vs_presupuesto.real },
    { name: 'Presupuesto', monto: data.comparativa_real_vs_presupuesto.presupuesto },
  ];

  const topProductosData = data.top_productos_coste_almacenaje.map((p) => ({
    name: p.nombre.length > 18 ? p.nombre.slice(0, 18) + '…' : p.nombre,
    coste: p.coste_almacenaje_estimado,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard Ejecutivo</h2>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<DollarSign size={20} />}
          label="Coste logístico total (mes)"
          value={`S/ ${data.coste_logistico_total_mes.toFixed(2)}`}
          color="bg-primary-700"
        />
        <KpiCard
          icon={<TrendingUp size={20} />}
          label="Uso de presupuesto"
          value={data.comparativa_real_vs_presupuesto.porcentaje_uso != null ? `${data.comparativa_real_vs_presupuesto.porcentaje_uso.toFixed(1)}%` : '-'}
          color={data.comparativa_real_vs_presupuesto.diferencia > 0 ? 'bg-red-600' : 'bg-green-600'}
        />
        <KpiCard
          icon={<Truck size={20} />}
          label="Coste de transporte por km"
          value={`S/ ${data.transporte.coste_por_km.toFixed(2)}`}
          color="bg-blue-600"
        />
        <KpiCard
          icon={<AlertTriangle size={20} />}
          label="Alertas activas"
          value={data.alertas_activas.length}
          color="bg-amber-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Desglose de costes por tipo (mes actual)</h3>
          {desgloseData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">Sin datos registrados este mes</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={desgloseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(d) => `${d.name}: S/ ${d.value.toFixed(0)}`}>
                  {desgloseData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `S/ ${Number(v).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Comparativa real vs presupuesto</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparativaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `S/ ${Number(v).toFixed(2)}`} />
              <Bar dataKey="monto" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            Diferencia: <span className={data.comparativa_real_vs_presupuesto.diferencia > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
              S/ {data.comparativa_real_vs_presupuesto.diferencia.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package size={18} /> Top 3 productos por coste de almacenaje
          </h3>
          {topProductosData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">Sin datos de inventario</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProductosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip formatter={(v) => `S/ ${Number(v).toFixed(2)}`} />
                <Bar dataKey="coste" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> Alertas activas de sobrecostes
          </h3>
          {data.alertas_activas.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No hay alertas activas</p>
          ) : (
            <div className="overflow-y-auto max-h-64 space-y-2">
              {data.alertas_activas.map((a) => (
                <div key={a.id} className="border border-red-100 bg-red-50 rounded-md p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{TIPO_LABELS[a.tipo] || a.tipo}</span>
                    <EstadoBadge estado={a.estado} />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    Esperado: S/ {Number(a.monto_esperado).toFixed(2)} · Real: S/ {Number(a.monto_real).toFixed(2)}
                    {' '}({Number(a.porcentaje_exceso).toFixed(1)}% exceso)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-3">
      <div className={`${color} text-white rounded-full p-2.5`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
