const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

function buildPgDumpCommand(filepath) {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  return `PGPASSWORD="${DB_PASSWORD}" pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -F p -f "${filepath}"`;
}

function ejecutarBackupAutomatico() {
  const filename = `backup_auto_${new Date().toISOString().slice(0, 10)}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);

  exec(buildPgDumpCommand(filepath), (error, stdout, stderr) => {
    if (error) {
      console.error('[Backup automático] Error:', stderr || error.message);
    } else {
      console.log(`[Backup automático] Generado correctamente: ${filename}`);
    }
  });
}

/**
 * RNF07 - Respaldos automáticos diarios.
 * Programa el primer backup al iniciar el servidor y luego cada 24 horas.
 */
function iniciarRespaldoAutomatico() {
  // Backup inicial (no bloqueante)
  setTimeout(ejecutarBackupAutomatico, 10_000);
  // Backup recurrente cada 24 horas
  setInterval(ejecutarBackupAutomatico, 24 * 60 * 60 * 1000);
}

module.exports = { iniciarRespaldoAutomatico, ejecutarBackupAutomatico };
