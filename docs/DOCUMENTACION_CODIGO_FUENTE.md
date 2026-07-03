# DOCUMENTACIÓN DE CÓDIGO FUENTE
## Sistema de Gestión y Control de Costes Logísticos - Plaza Vea

---

## 3.1 Estructura del Proyecto

El proyecto sigue una arquitectura de tres capas con separación clara entre frontend, backend y base de datos para la gestión logística de **Plaza Vea**, una de las cadenas de supermercados más importantes del Perú. La estructura de directorios está organizada para facilitar el mantenimiento y escalabilidad del sistema de gestión de centros de distribución.

### Estructura de Directorios Principal

```
/logistic-cost-system
├── backend/                    # Backend API (Node.js + Express) para gestión de Plaza Vea
│   ├── src/
│   │   ├── controllers/        # Lógica de negocio por entidad (proveedores de productos de consumo, inventarios de supermercado, centros de distribución)
│   │   ├── models/            # Acceso a datos (SQL crudo vía pg) para cadena de suministro
│   │   ├── routes/            # Definición de endpoints REST
│   │   ├── middleware/        # auth (JWT/roles), validación, auditoría de operaciones logísticas
│   │   ├── utils/             # calculosCostes, generadorReportes, backupScheduler
│   │   ├── database/          # schema.sql, seed.js, conexión
│   │   └── server.js          # Punto de entrada principal
│   ├── Dockerfile             # Configuración de contenedor Docker
│   ├── package.json           # Dependencias de Node.js
│   └── .env.example           # Variables de entorno de ejemplo
├── frontend/                  # Frontend (React + Vite) para gestión de Plaza Vea
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, Layout, Tabla, Modal, etc.
│   │   ├── pages/             # Login, Dashboard, Compras, Inventario, Costes, ...
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── services/          # api.js (axios), endpoints.js
│   │   └── App.jsx            # Componente principal
│   ├── Dockerfile             # Configuración de contenedor Docker
│   ├── package.json           # Dependencias de Node.js
│   └── .env.example           # Variables de entorno de ejemplo
├── docs/                      # Documentación del proyecto de Plaza Vea
│   ├── MEMORIA_DESCRIPTIVA.md # Memoria descriptiva del sistema de gestión de supermercado
│   ├── MANUAL_USUARIO.md       # Manual de usuario para centros de distribución
│   └── DOCUMENTACION_CODIGO_FUENTE.md # Este documento
├── docker-compose.yml         # Orquestación de contenedores Docker
├── .gitignore                 # Archivos excluidos de Git
├── README.md                  # Documentación general del proyecto de Plaza Vea
└── QUICKSTART.md              # Guía de inicio rápido
```

### Estructura Detallada del Backend

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js        # Lógica de autenticación para usuarios de Plaza Vea
│   │   ├── proveedoresController.js # CRUD de proveedores de productos de consumo
│   │   ├── productosController.js  # CRUD de productos de supermercado
│   │   ├── ordenesCompraController.js # Gestión de órdenes de compra
│   │   ├── inventarioController.js  # Gestión de inventarios por centro de distribución
│   │   ├── costesAlmacenamientoController.js # Costes operativos de centros de distribución
│   │   ├── costesTransporteController.js # Costes de transporte entre centros
│   │   ├── distribucionesController.js # Gestión de distribuciones
│   │   ├── alertasController.js     # Gestión de alertas de sobrecostes
│   │   ├── auditoriaController.js   # Registro de auditoría de operaciones
│   │   ├── usuariosController.js    # Gestión de usuarios
│   │   ├── reportesController.js    # Generación de reportes de Plaza Vea
│   │   └── dashboardController.js  # KPIs ejecutivos de cadena de suministro
│   ├── models/
│   │   ├── db.js                    # Conexión a PostgreSQL para Plaza Vea
│   │   ├── proveedoresModel.js      # Consultas SQL proveedores de productos de consumo
│   │   ├── productosModel.js        # Consultas SQL productos de supermercado
│   │   ├── ordenesCompraModel.js   # Consultas SQL órdenes de compra
│   │   ├── inventarioModel.js      # Consultas SQL inventario por centro de distribución
│   │   ├── costesModel.js          # Consultas SQL costes logísticos
│   │   ├── distribucionesModel.js  # Consultas SQL distribuciones
│   │   ├── alertasModel.js         # Consultas SQL alertas de sobrecostes
│   │   ├── auditoriaModel.js       # Consultas SQL auditoría de operaciones
│   │   └── usuariosModel.js        # Consultas SQL usuarios
│   ├── routes/
│   │   ├── authRoutes.js            # Endpoints de autenticación para Plaza Vea
│   │   ├── proveedoresRoutes.js    # Endpoints de proveedores de productos de consumo
│   │   ├── productosRoutes.js      # Endpoints de productos de supermercado
│   │   ├── ordenesCompraRoutes.js  # Endpoints de órdenes de compra
│   │   ├── inventarioRoutes.js     # Endpoints de inventario por centro de distribución
│   │   ├── costesRoutes.js         # Endpoints de costes logísticos
│   │   ├── distribucionesRoutes.js # Endpoints de distribuciones
│   │   ├── alertasRoutes.js         # Endpoints de alertas de sobrecostes
│   │   ├── auditoriaRoutes.js      # Endpoints de auditoría
│   │   ├── usuariosRoutes.js       # Endpoints de usuarios
│   │   ├── reportesRoutes.js       # Endpoints de reportes
│   │   └── dashboardRoutes.js      # Endpoints de dashboard
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verificación JWT para usuarios de Plaza Vea
│   │   ├── roleMiddleware.js       # Verificación de roles para centros de distribución
│   │   ├── validatorMiddleware.js  # Validación de datos de productos de consumo
│   │   ├── auditoriaMiddleware.js  # Registro de cambios en operaciones logísticas
│   │   └── errorHandler.js         # Manejo centralizado de errores
│   ├── utils/
│   │   ├── calculosCostes.js       # Cálculos de costes logísticos de Plaza Vea
│   │   ├── generadorReportes.js    # Generación PDF/Excel de supermercado
│   │   └── backupScheduler.js      # Programación de backups de centros de distribución
│   ├── database/
│   │   ├── schema.sql              # Schema de base de datos para Plaza Vea
│   │   ├── seed.js                 # Datos iniciales de supermercado
│   │   └── db.js                   # Configuración de conexión
│   └── server.js                  # Servidor Express
├── Dockerfile
├── package.json
└── .env.example
```

### Estructura Detallada del Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx           # Barra de navegación superior de Plaza Vea
│   │   │   ├── Sidebar.jsx          # Menú lateral de centros de distribución
│   │   │   └── Layout.jsx           # Layout principal
│   │   ├── UI/
│   │   │   ├── Tabla.jsx            # Componente de tabla genérico
│   │   │   ├── Modal.jsx            # Componente de modal
│   │   │   ├── Formulario.jsx       # Componente de formulario
│   │   │   ├── Filtro.jsx           # Componente de filtros
│   │   │   └── Boton.jsx           # Componente de botón
│   │   ├── Dashboard/
│   │   │   ├── KPICard.jsx          # Tarjeta de KPI de cadena de suministro
│   │   │   ├── GraficoCostes.jsx   # Gráfico de costes logísticos
│   │   │   └── AlertasWidget.jsx    # Widget de alertas de sobrecostes
│   │   └── Comunes/
│   │       ├── LoadingSpinner.jsx   # Indicador de carga
│   │       └── ErrorBoundary.jsx    # Manejo de errores
│   ├── pages/
│   │   ├── Login.jsx               # Página de inicio de sesión para Plaza Vea
│   │   ├── Dashboard.jsx           # Dashboard principal de supermercado
│   │   ├── Compras/
│   │   │   ├── Proveedores.jsx     # Gestión de proveedores de productos de consumo
│   │   │   └── OrdenesCompra.jsx   # Gestión de órdenes de compra
│   │   ├── Inventario/
│   │   │   ├── Productos.jsx       # Gestión de productos de supermercado
│   │   │   └── Inventario.jsx      # Gestión de inventario por centro de distribución
│   │   ├── Costes/
│   │   │   ├── Almacenamiento.jsx  # Costes de almacenamiento de centros de distribución
│   │   │   └── Transporte.jsx      # Costes de transporte entre centros
│   │   ├── Distribucion/
│   │   │   ├── Distribuciones.jsx  # Gestión de distribuciones de Plaza Vea
│   │   │   └── Vehiculos.jsx       # Gestión de la flota Plaza Vea
│   │   ├── Alertas.jsx             # Gestión de alertas de sobrecostes logísticos
│   │   ├── Auditoria.jsx           # Registro de auditoría de operaciones
│   │   ├── Reportes/
│   │   │   ├── ReportesPDF.jsx     # Generación de PDF de Plaza Vea
│   │   │   └── ReportesExcel.jsx   # Generación de Excel de supermercado
│   │   ├── Usuarios.jsx            # Gestión de usuarios de centros de distribución (Admin)
│   │   └── Backups.jsx             # Gestión de backups de cadena de suministro (Admin)
│   ├── context/
│   │   ├── AuthContext.jsx         # Contexto de autenticación para Plaza Vea
│   │   └── ThemeContext.jsx        # Contexto de tema
│   ├── services/
│   │   ├── api.js                  # Cliente Axios configurado para centros de distribución
│   │   └── endpoints.js            # Definición de endpoints API
│   ├── utils/
│   │   ├── formatters.js           # Formateo de datos de supermercado
│   │   ├── validators.js           # Validaciones personalizadas
│   │   └── constants.js            # Constantes de la aplicación de Plaza Vea
│   ├── App.jsx                    # Componente principal de Plaza Vea
│   └── main.jsx                   # Punto de entrada
├── public/
│   └── index.html                 # Plantilla HTML
├── Dockerfile
├── package.json
├── vite.config.js                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
└── .env.example
```

---

## 3.2 Componentes del Código

### Módulos de Autenticación

#### Backend: AuthController.js

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login de usuario
async function login(req, res) {
  const { email, password } = req.body;
  
  // Verificar credenciales
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) return res.status(401).json({ error: 'Credenciales inválidas' });
  
  // Generar token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  res.json({ token, user: { id: user.id, email: user.email, role: user.rol } });
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}
```

#### Frontend: AuthContext.jsx

```javascript
import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar token y establecer usuario
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Módulos de Gestión de Datos

#### Backend: ProveedoresController.js

```javascript
const pool = require('../models/db');

// Obtener todos los proveedores
async function getProveedores(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM proveedores WHERE activo = true ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Crear nuevo proveedor
async function createProveedor(req, res) {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, contacto, telefono, email, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Actualizar proveedor
async function updateProveedor(req, res) {
  const { id } = req.params;
  const { nombre, contacto, telefono, email, direccion } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE proveedores SET nombre=$1, contacto=$2, telefono=$3, email=$4, direccion=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [nombre, contacto, telefono, email, direccion, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar proveedor (soft delete)
async function deleteProveedor(req, res) {
  const { id } = req.params;
  
  try {
    await pool.query(
      'UPDATE proveedores SET activo=false WHERE id=$1',
      [id]
    );
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Frontend: Proveedores.jsx

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';
import Tabla from '../components/UI/Tabla';
import Modal from '../components/UI/Modal';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Cargar proveedores
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    const response = await api.get('/proveedores');
    setProveedores(response.data);
  };

  // Crear proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/proveedores', formData);
    setModalOpen(false);
    cargarProveedores();
  };

  const columnas = [
    { header: 'Nombre', key: 'nombre' },
    { header: 'Contacto', key: 'contacto' },
    { header: 'Teléfono', key: 'telefono' },
    { header: 'Email', key: 'email' },
    { header: 'Dirección', key: 'direccion' }
  ];

  return (
    <div>
      <h1>Gestión de Proveedores</h1>
      <button onClick={() => setModalOpen(true)}>Nuevo Proveedor</button>
      <Tabla datos={proveedores} columnas={columnas} />
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <input 
            placeholder="Nombre" 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          />
          <input 
            placeholder="Contacto" 
            onChange={(e) => setFormData({...formData, contacto: e.target.value})}
          />
          <button type="submit">Guardar</button>
        </form>
      </Modal>
    </div>
  );
}
```

### Módulos de Reportes

#### Backend: GeneradorReportes.js

```javascript
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Generar reporte PDF
async function generarPDF(tipo, filtros) {
  const doc = new PDFDocument();
  const stream = require('stream');
  const buffer = [];
  
  doc.on('data', buffer.push.bind(buffer));
  
  // Encabezado
  doc.fontSize(20).text(`Reporte de ${tipo}`, { align: 'center' });
  doc.moveDown();
  
  // Contenido según tipo
  switch(tipo) {
    case 'proveedores':
      const proveedores = await getProveedores(filtros);
      proveedores.forEach(p => {
        doc.text(`${p.nombre} - ${p.contacto}`);
      });
      break;
    // Otros casos...
  }
  
  doc.end();
  return Buffer.concat(buffer);
}

// Generar reporte Excel
async function generarExcel(tipo, filtros) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(tipo);
  
  // Encabezados
  worksheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre', key: 'nombre' },
    // Otros campos...
  ];
  
  // Datos
  const datos = await getDatos(tipo, filtros);
  datos.forEach(dato => {
    worksheet.addRow(dato);
  });
  
  return await workbook.xlsx.writeBuffer();
}
```

### Conexión con la Base de Datos

#### Backend: db.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'logistic_cost_system',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en cliente idle', err);
  process.exit(-1);
});

module.exports = pool;
```

#### Backend: schema.sql

El schema.sql define la estructura completa de la base de datos con 15 tablas:

```sql
-- Tablas principales
CREATE TABLE roles (...);
CREATE TABLE usuarios (...);
CREATE TABLE proveedores (...);
CREATE TABLE productos (...);
CREATE TABLE almacenes (...);
CREATE TABLE inventarios (...);
CREATE TABLE ordenes_compra (...);
CREATE TABLE detalles_compra (...);
CREATE TABLE costes_almacenamiento (...);
CREATE TABLE vehiculos (...);
CREATE TABLE costes_transporte (...);
CREATE TABLE distribuciones (...);
CREATE TABLE costes_logisticos_totales (...);
CREATE TABLE alertas_sobrecostes (...);
CREATE TABLE auditorias (...);
CREATE TABLE configuracion_alertas (...);

-- Triggers para updated_at
CREATE TRIGGER update_timestamp BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Validaciones y Seguridad

#### Backend: ValidatorMiddleware.js

```javascript
const { body, validationResult } = require('express-validator');

// Validación de proveedor
const validateProveedor = [
  body('nombre').notEmpty().withMessage('Nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefono').isLength({ min: 9 }).withMessage('Teléfono inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validación de orden de compra
const validateOrdenCompra = [
  body('proveedor_id').isInt().withMessage('Proveedor inválido'),
  body('productos').isArray().withMessage('Productos requeridos'),
  body('productos.*.producto_id').isInt().withMessage('Producto inválido'),
  body('productos.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad mínima 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

#### Backend: AuditoriaMiddleware.js

```javascript
async function registrarAuditoria(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Registrar la operación si fue exitosa
    if (res.statusCode < 400) {
      pool.query(
        'INSERT INTO auditorias (usuario_id, accion, tabla, registro_id, detalles) VALUES ($1, $2, $3, $4, $5)',
        [req.user.userId, req.method, req.path, req.params.id, JSON.stringify(req.body)]
      );
    }
    originalSend.call(this, data);
  };
  
  next();
}
```

#### Backend: RoleMiddleware.js

```javascript
function checkRole(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}

// Uso
router.get('/admin', authenticateToken, checkRole(['Administrador']), adminController);
```

---

## 3.3 Instrucciones de Instalación

### Configuración del Entorno

#### Requisitos Previos

Antes de comenzar, asegúrese de tener instalado:

1. **Docker Desktop**: Descargar e instalar desde https://www.docker.com/products/docker-desktop
2. **Docker Compose**: Incluido con Docker Desktop
3. **Git**: Para clonar el repositorio (opcional si ya tiene los archivos)

#### Verificación de Instalación

```bash
# Verificar Docker
docker --version
# Salida esperada: Docker version 20.10.x o superior

# Verificar Docker Compose
docker-compose --version
# Salida esperada: Docker Compose version 2.0.x o superior
```

### Instalación de Dependencias

#### Clonar el Repositorio (si aplica)

```bash
git clone <URL_DEL_REPOSITORIO>
cd logistic-cost-system
```

#### Configuración de Variables de Entorno

El sistema utiliza archivos `.env` para configuración. Se proporcionan archivos `.env.example` como plantilla.

**Backend (.env)**:

```bash
# Copiar archivo de ejemplo
cd backend
cp .env.example .env

# Editar .env con los siguientes valores:
PORT=4000
NODE_ENV=production
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=logistic_cost_system
JWT_SECRET=cambia_este_secreto_por_uno_seguro
JWT_EXPIRES_IN=8h
DEFAULT_ALERT_THRESHOLD=10
```

**Frontend (.env)**:

```bash
# Copiar archivo de ejemplo
cd frontend
cp .env.example .env

# Editar .env con:
VITE_API_URL=http://localhost:4000/api
```

**Nota**: En producción, cambie `JWT_SECRET` por una cadena segura y aleatoria.

### Configuración de la Base de Datos

La base de datos PostgreSQL se configura automáticamente a través de Docker Compose. No se requiere configuración manual adicional.

#### Estructura de la Base de Datos

El sistema utiliza PostgreSQL 16 con el siguiente schema:

- **15 tablas relacionales** con integridad referencial
- **Triggers automáticos** para timestamps `updated_at`
- **Índices** en columnas frecuentemente consultadas
- **Restricciones CHECK** para validación de datos

#### Datos Iniciales

El script `seed.js` se ejecuta automáticamente al iniciar el sistema y crea:
- Schema completo de 15 tablas
- 4 roles de usuario
- 4 usuarios demo con contraseñas hasheadas
- 8 proveedores
- 15 productos
- 4 almacenes
- 6 vehículos
- Datos de ejemplo para costes, distribuciones y alertas

### Ejecución del Sistema

#### Método 1: Docker Compose (Recomendado)

Este es el método más simple y recomendado para desarrollo y producción.

```bash
# Desde el directorio raíz del proyecto
docker-compose up --build
```

Este comando:
1. Construye las imágenes Docker para backend y frontend
2. Inicia el contenedor de PostgreSQL
3. Ejecuta `seed.js` para inicializar la base de datos
4. Inicia el servidor backend en el puerto 4000
5. Inicia el servidor frontend en el puerto 5173

#### Verificar que el Sistema Está Funcionando

```bash
# Verificar contenedores
docker ps
# Debe mostrar 3 contenedores: logistic_db, logistic_backend, logistic_frontend

# Verificar health check de la base de datos
docker exec logistic_db pg_isready -U postgres
# Salida esperada: localhost:5432 - accepting connections

# Verificar API health check
curl http://localhost:4000/api/health
# Salida esperada: {"status":"ok","timestamp":"..."}
```

#### Acceder al Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **PostgreSQL**: localhost:5432

#### Método 2: Desarrollo Local (Sin Docker)

Si prefiere desarrollar sin Docker, puede ejecutar los servicios localmente.

**Backend**:

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con credenciales de PostgreSQL local
npm run seed
npm run dev
```

**Frontend**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Base de Datos PostgreSQL Local**:

```bash
# Crear base de datos
createdb logistic_cost_system

# Ejecutar schema
psql logistic_cost_system < backend/src/database/schema.sql

# Ejecutar seed
node backend/src/database/seed.js
```

### Detener el Sistema

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (cuidado: se pierden datos)
docker-compose down -v
```

### Reiniciar el Sistema

```bash
# Reiniciar contenedores
docker-compose restart

# Reconstruir y reiniciar
docker-compose up --build --force-recreate
```

---

## 3.4 Repositorio del Proyecto

### Ubicación del Repositorio

El código fuente del sistema se almacena en un repositorio Git para control de versiones y mantenimiento.

**Repositorio**: [URL_DEL_REPOSITORIO_GIT]
**Plataforma**: GitHub / GitLab / Bitbucket
**Rama Principal**: `master`

### Estructura del Repositorio

```
master (rama principal)
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── README.md
├── QUICKSTART.md
├── .gitignore
└── .env.example (archivos de ejemplo)
```

### Ramas de Desarrollo

- **master**: Rama principal con código estable de producción
- **develop**: Rama de desarrollo para integración de nuevas características
- **feature/nombre-caracteristica**: Ramas temporales para desarrollo de características específicas
- **hotfix/nombre-correccion**: Ramas temporales para correcciones urgentes en producción

### Flujo de Trabajo Git

#### Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd logistic-cost-system
```

#### Crear una Rama de Característica

```bash
git checkout -b feature/nueva-caracteristica
```

#### Realizar Cambios y Commits

```bash
# Verificar cambios
git status

# Agregar archivos modificados
git add .

# Commit con mensaje descriptivo
git commit -m "Descripción de los cambios realizados"
```

#### Push al Repositorio Remoto

```bash
git push origin feature/nueva-caracteristica
```

#### Crear Pull Request

1. Abra un Pull Request desde la rama de característica hacia `develop` o `master`
2. Solicite revisión de código
3. Después de aprobación, merge a la rama destino

### Convenciones de Commits

Utilice el formato de mensajes de commit de Conventional Commits:

```
<tipo>(<alcance>): <descripción>

[opcional cuerpo]

[opcional pie de página]
```

**Tipos comunes**:
- `feat`: Nueva característica
- `fix`: Corrección de error
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, sangría, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar pruebas
- `chore`: Mantenimiento general

**Ejemplos**:
```
feat(proveedores): agregar campo de contacto secundario
fix(inventario): corregir cálculo de stock total
docs(readme): actualizar instrucciones de instalación
```

### Gestión de Issues

Los issues se utilizan para seguimiento de tareas, errores y mejoras:

**Etiquetas comunes**:
- `bug`: Error reportado
- `enhancement`: Solicitud de mejora
- `documentation`: Tarea de documentación
- `priority: high`: Alta prioridad
- `priority: medium`: Prioridad media
- `priority: low`: Baja prioridad

### Control de Versiones

El sistema sigue el versionado semántico (Semantic Versioning):

```
MAJOR.MINOR.PATCH

MAJOR: Cambios incompatibles con la versión anterior
MINOR: Nueva funcionalidad compatible hacia atrás
PATCH: Correcciones de errores compatibles hacia atrás
```

**Ejemplo**: `1.0.0` → `1.1.0` → `1.1.1` → `2.0.0`

### Releases

Para crear una nueva versión:

```bash
# Actualizar versión en package.json
npm version patch  # o minor, o major

# Crear tag de Git
git tag -a v1.0.0 -m "Versión 1.0.0"
git push origin v1.0.0
```

### Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Cree una rama para su característica
3. Realice sus cambios siguiendo las convenciones de código
4. Escriba pruebas si aplica
5. Actualice la documentación
6. Abra un Pull Request con descripción clara de los cambios

### Licencia

Este proyecto está licenciado bajo [TIPO_DE_LICENCIA]. Consulte el archivo LICENSE para más detalles.

### Soporte y Contacto

Para preguntas sobre el código fuente o contribuciones:
- **Email**: desarrollo@logisticacostes.com
- **Issues**: [URL_DEL_REPOSITORIO]/issues
- **Discusiones**: [URL_DEL_REPOSITORIO]/discussions

---

## Conclusión

Esta documentación del código fuente proporciona una visión completa de la estructura, componentes y procedimientos de instalación del Sistema de Gestión y Control de Costes Logísticos. Para preguntas adicionales o aclaraciones técnicas, consulte los otros documentos de la serie:

- **Memoria Descriptiva**: Visión general del sistema y justificación técnica
- **Manual de Usuario**: Guía operativa para usuarios finales
- **Documentación de Código Fuente**: Detalles técnicos para desarrolladores

El código fuente está diseñado siguiendo mejores prácticas de desarrollo software, con separación de responsabilidades, modularidad y documentación clara para facilitar el mantenimiento y escalabilidad del sistema.
