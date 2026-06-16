# Sistema de Gestión y Control de Costes Logísticos

Aplicación web completa (full-stack) para automatizar compras, inventario, costes de
almacenamiento/transporte, distribución, alertas de sobrecostes, trazabilidad, auditoría,
dashboards ejecutivos y reportes PDF/Excel.

## Stack tecnológico
- **Backend**: Node.js + Express, PostgreSQL (`pg`), JWT + bcrypt, express-validator, pdfkit, exceljs
- **Frontend**: React (Vite) + Tailwind CSS + React Router + Recharts + Axios
- **Infraestructura**: Docker + docker-compose

## Cómo ejecutar (Docker)

```bash
docker-compose up --build
```

- Backend API: http://localhost:4000/api
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432 (user: postgres / password: postgres / db: logistic_cost_system)

Al iniciar, el contenedor `backend` ejecuta automáticamente `seed.js`, que crea el schema
(15 tablas), datos de ejemplo y los usuarios demo con contraseñas hasheadas reales.

## Usuarios precargados

| Email | Password | Rol |
|---|---|---|
| admin@logistica.com | admin123 | Administrador |
| operador@logistica.com | oper123 | Operador Logistico |
| supervisor@logistica.com | sup123 | Supervisor |
| gerente@logistica.com | ger123 | Gerente |

## Datos de ejemplo incluidos
- 8 proveedores (distribuidoras nacionales e internacionales)
- 15 productos de embalaje y logística (cajas, pallets, films, flejes, contenedores, etc.)
- 4 almacenes (Trujillo, La Esperanza, Lima, Arequipa) con inventario distribuido
- 6 vehículos (camiones de diferentes capacidades y marcas)
- 6 órdenes de compra con diferentes estados (pendiente, en almacén, en tránsito, entregado)
- 13 registros de costes de almacenamiento (alquiler, mantenimiento, servicios, mano de obra)
- 10 registros de costes de transporte (combustible, peajes, mantenimiento, conductor)
- 6 distribuciones asignadas con estados variados
- 5 alertas de sobrecostes activas/revisadas
- Configuración de umbrales de alertas por tipo de operación (compra, almacenamiento, transporte, distribución, general)

## Módulos implementados (RF01-RF18 / RNF01-RNF10)

1. **Autenticación y roles** (JWT + bcrypt): Administrador, Operador Logístico, Supervisor, Gerente
2. **Proveedores** (CRUD)
3. **Productos** (CRUD, alerta de bajo stock)
4. **Órdenes de compra** (registro + detalle, validación automática)
5. **Inventario**: actualización automática al recibir mercancía + ajustes manuales
6. **Costes de almacenamiento** (alquiler, mantenimiento, mano de obra, servicios, otros)
7. **Costes de transporte** (combustible, peajes, mantenimiento, conductor → coste/km automático)
8. **Cálculo automático de costes logísticos totales** (`costes_logisticos_totales`), ejecutado
   automáticamente al registrar compras, costes de almacén, transporte y distribución
9. **Reportes PDF/Excel** de todas las tablas principales + resumen financiero ejecutivo
10. **Dashboard ejecutivo** con KPIs: coste total mensual, real vs presupuesto, top 3 productos
    por coste de almacenaje, coste de transporte/km, alertas activas
11. **Trazabilidad completa** de pedidos (línea de tiempo, estados, costes asociados, auditoría)
12. **Alertas automáticas de sobrecostes** con umbral configurable por tipo de operación
13. **Gestión de vehículos** y mantenimiento (estado: disponible/en ruta/mantenimiento/inactivo)
14. **Registro de gastos operativos** (vía costes de almacenamiento, tipo "otros")
15. **Distribución logística**: asignación de rutas y vehículos a órdenes de compra
16. **Estados de pedido**: pendiente → en almacén → en tránsito → entregado / cancelado
17. **Auditoría de cambios**: quién, qué, cuándo (tabla `auditorias`, panel filtrable)
18. **Copias de seguridad**: manual (botón) y automática (cada 24h vía `pg_dump`)

## Estructura del proyecto

```
/logistic-cost-system
├── backend/
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio por entidad
│   │   ├── models/        # Acceso a datos (SQL crudo vía pg)
│   │   ├── routes/         # Definición de endpoints REST
│   │   ├── middleware/      # auth (JWT/roles), validación, auditoría
│   │   ├── utils/           # calculosCostes, generadorReportes, backupScheduler
│   │   └── database/        # schema.sql, seed.js, conexión
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, Layout, Tabla, Modal, etc.
│   │   ├── pages/           # Login, Dashboard, Compras, Inventario, Costes, ...
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── services/        # api.js (axios), endpoints.js
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Permisos por rol (resumen)
- **Administrador**: acceso total, gestión de usuarios, configuración de alertas, auditoría, backups
- **Operador Logístico**: CRUDs operativos (proveedores, productos, compras, costes, distribución)
- **Supervisor**: lectura + gestión de estados/alertas + auditoría
- **Gerente**: lectura, dashboard, reportes, configuración de alertas

## Desarrollo local sin Docker

```bash
# Backend
cd backend
cp .env.example .env   # ajustar credenciales de PostgreSQL local
npm install
npm run seed             # crea schema + datos + usuarios demo
npm run dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

> Nota: la generación de copias de seguridad requiere `pg_dump` instalado en el sistema/contenedor
> (incluido en el Dockerfile del backend vía `postgresql-client`).
