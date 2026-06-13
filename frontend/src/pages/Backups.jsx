import React, { useEffect, useState } from 'react';
import { DatabaseBackup, RefreshCw } from 'lucide-react';
import Tabla from '../components/Tabla';
import { backupsService } from '../services/endpoints';

export default function Backups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await backupsService.listar();
      setBackups(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const generarBackup = async () => {
    setGenerando(true);
    try {
      await backupsService.crear();
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al generar la copia de seguridad');
    } finally {
      setGenerando(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const columnas = [
    { key: 'filename', label: 'Archivo' },
    { key: 'size_bytes', label: 'Tamaño', render: (r) => formatSize(r.size_bytes) },
    { key: 'created_at', label: 'Fecha de creación', render: (r) => new Date(r.created_at).toLocaleString('es-PE') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <DatabaseBackup size={22} /> Copias de Seguridad
        </h2>
        <button onClick={generarBackup} disabled={generando} className="btn-primary flex items-center gap-2">
          <RefreshCw size={16} className={generando ? 'animate-spin' : ''} />
          {generando ? 'Generando...' : 'Generar copia ahora'}
        </button>
      </div>

      <p className="text-sm text-gray-500">
        El sistema genera automáticamente una copia de seguridad diaria. También puede generar una copia manual en cualquier momento.
      </p>

      {loading ? <p className="text-gray-500">Cargando...</p> : <Tabla columnas={columnas} datos={backups} emptyMessage="Aún no se han generado copias de seguridad" />}
    </div>
  );
}
