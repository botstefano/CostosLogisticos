import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import { descargarArchivo } from '../services/api';
import { REPORT_TABLES } from '../services/endpoints';

export default function Reportes() {
  const [descargando, setDescargando] = useState(null);

  const exportar = async (tabla, formato) => {
    const key = `${tabla}-${formato}`;
    setDescargando(key);
    try {
      await descargarArchivo(`/reportes/${tabla}/${formato}`, `${tabla}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (err) {
      alert('Error al generar el reporte. Verifique sus permisos.');
    } finally {
      setDescargando(null);
    }
  };

  const exportarResumen = async (formato) => {
    const key = `resumen-${formato}`;
    setDescargando(key);
    try {
      await descargarArchivo(`/reportes/resumen-financiero/${formato}`, `resumen_financiero.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (err) {
      alert('Error al generar el reporte');
    } finally {
      setDescargando(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Reportes Financieros</h2>

      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-1">Resumen financiero ejecutivo</h3>
        <p className="text-sm text-gray-500 mb-3">
          Coste logístico total del mes, desglose por tipo, top productos por coste de almacenaje y coste de transporte por km.
        </p>
        <div className="flex gap-2">
          <button onClick={() => exportarResumen('pdf')} disabled={descargando === 'resumen-pdf'} className="btn-primary flex items-center gap-2">
            <FileText size={16} /> {descargando === 'resumen-pdf' ? 'Generando...' : 'Exportar PDF'}
          </button>
          <button onClick={() => exportarResumen('excel')} disabled={descargando === 'resumen-excel'} className="btn-secondary flex items-center gap-2">
            <FileSpreadsheet size={16} /> {descargando === 'resumen-excel' ? 'Generando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Exportar por tabla</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORT_TABLES.map((t) => (
            <div key={t.key} className="card flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-primary-700" />
                <span className="font-medium text-gray-700">{t.label}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => exportar(t.key, 'pdf')}
                  disabled={descargando === `${t.key}-pdf`}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <FileText size={14} /> PDF
                </button>
                <button
                  onClick={() => exportar(t.key, 'excel')}
                  disabled={descargando === `${t.key}-excel`}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                >
                  <FileSpreadsheet size={14} /> Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
