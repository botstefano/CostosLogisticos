import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

/**
 * Tabla genérica.
 * columnas: [{ key, label, render?(row) }]
 * onEdit / onDelete: opcionales, si se pasan se muestra columna de acciones.
 */
export default function Tabla({ columnas, datos, onEdit, onDelete, emptyMessage = 'No hay registros disponibles' }) {
  const mostrarAcciones = onEdit || onDelete;

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="table-base">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {mostrarAcciones && <th className="text-center">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length + (mostrarAcciones ? 1 : 0)} className="text-center text-gray-400 py-6">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            datos.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columnas.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? '-')}</td>
                ))}
                {mostrarAcciones && (
                  <td className="text-center whitespace-nowrap">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="text-primary-700 hover:text-primary-900 p-1" title="Editar">
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800 p-1" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
