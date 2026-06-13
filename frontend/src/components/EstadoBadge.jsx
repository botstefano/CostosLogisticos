import React from 'react';

const ESTADO_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  'en almacen': 'bg-blue-100 text-blue-800',
  'en transito': 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-gray-200 text-gray-600',
  activa: 'bg-red-100 text-red-700',
  revisada: 'bg-yellow-100 text-yellow-800',
  resuelta: 'bg-green-100 text-green-800',
  descartada: 'bg-gray-200 text-gray-600',
  disponible: 'bg-green-100 text-green-800',
  'en ruta': 'bg-purple-100 text-purple-800',
  mantenimiento: 'bg-yellow-100 text-yellow-800',
  inactivo: 'bg-gray-200 text-gray-600',
};

export default function EstadoBadge({ estado }) {
  const style = ESTADO_STYLES[estado] || 'bg-gray-100 text-gray-700';
  return <span className={`badge ${style}`}>{estado}</span>;
}
