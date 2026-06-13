/**
 * Script de inicialización de base de datos.
 * 1. Ejecuta schema.sql (crea tablas, catálogos, datos de ejemplo).
 * 2. Genera hashes bcrypt reales para los usuarios precargados
 *    y los actualiza en la tabla usuarios.
 *
 * Uso: node src/database/seed.js
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require('./db');

const USUARIOS_DEMO = [
  { email: 'admin@logistica.com', password: 'admin123' },
  { email: 'operador@logistica.com', password: 'oper123' },
  { email: 'supervisor@logistica.com', password: 'sup123' },
  { email: 'gerente@logistica.com', password: 'ger123' },
];

async function run() {
  const client = await pool.connect();
  try {
    console.log('Ejecutando schema.sql ...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSQL);
    console.log('Schema y datos de ejemplo creados correctamente.');

    console.log('Generando contraseñas (bcrypt) para usuarios demo...');
    for (const u of USUARIOS_DEMO) {
      const hash = await bcrypt.hash(u.password, 10);
      await client.query(
        'UPDATE usuarios SET password_hash = $1 WHERE email = $2',
        [hash, u.email]
      );
      console.log(`  - ${u.email} -> contraseña actualizada`);
    }

    console.log('\n✅ Base de datos inicializada correctamente.');
    console.log('\nUsuarios disponibles:');
    USUARIOS_DEMO.forEach((u) => console.log(`  ${u.email} / ${u.password}`));
  } catch (err) {
    console.error('❌ Error inicializando la base de datos:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
