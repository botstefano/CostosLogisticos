require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/validation');
const { iniciarRespaldoAutomatico } = require('./utils/backupScheduler');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const productoRoutes = require('./routes/productoRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const compraRoutes = require('./routes/compraRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const costeAlmacenamientoRoutes = require('./routes/costeAlmacenamientoRoutes');
const costeTransporteRoutes = require('./routes/costeTransporteRoutes');
const costeTotalRoutes = require('./routes/costeTotalRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const distribucionRoutes = require('./routes/distribucionRoutes');
const trazabilidadRoutes = require('./routes/trazabilidadRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const backupRoutes = require('./routes/backupRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// RNF04 - API REST bien estructurada bajo /api
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/almacenes', almacenRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/inventarios', inventarioRoutes);
app.use('/api/costes-almacenamiento', costeAlmacenamientoRoutes);
app.use('/api/costes-transporte', costeTransporteRoutes);
app.use('/api/costes-totales', costeTotalRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/distribuciones', distribucionRoutes);
app.use('/api/trazabilidad', trazabilidadRoutes);
app.use('/api/auditorias', auditoriaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/backups', backupRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor de Sistema de Costes Logísticos escuchando en puerto ${PORT}`);
  // Iniciar respaldo automático solo si DB_HOST está configurado
  if (process.env.DB_HOST) {
    iniciarRespaldoAutomatico();
  }
});
