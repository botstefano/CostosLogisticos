const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { asyncHandler } = require('../middleware/validation');

const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function buildPgDumpCommand(filepath) {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  return `PGPASSWORD="${DB_PASSWORD}" pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -F p -f "${filepath}"`;
}

// RF18 - Copia de seguridad manual
const crearBackup = asyncHandler(async (req, res) => {
  const filename = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);

  exec(buildPgDumpCommand(filepath), (error, stdout, stderr) => {
    if (error) {
      console.error('Error generando backup:', stderr || error.message);
      return res.status(500).json({ error: 'Error generando la copia de seguridad. Verifique que pg_dump esté disponible en el servidor.' });
    }
    res.json({ message: 'Copia de seguridad generada correctamente', filename });
  });
});

// RF18 - Listar copias de seguridad disponibles
const listarBackups = asyncHandler(async (req, res) => {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith('.sql'))
    .map((f) => {
      const stats = fs.statSync(path.join(BACKUP_DIR, f));
      return { filename: f, size_bytes: stats.size, created_at: stats.birthtime };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(files);
});

// RF18 - Descargar una copia de seguridad
const descargarBackup = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // Evitar path traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Nombre de archivo inválido' });
  }

  const filepath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Archivo de respaldo no encontrado' });
  }

  res.download(filepath);
});

module.exports = { crearBackup, listarBackups, descargarBackup };
