# Guía de Inicio Rápido

## Requisitos Previos

- Docker y Docker Compose instalados
- Git (para clonar el repositorio)

## Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd logistic-cost-system
```

### 2. Levantar el Sistema con Docker

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker para backend y frontend
- Inicia PostgreSQL con configuración de locale corregida
- Ejecuta automáticamente `seed.js` que crea:
  - 15 tablas de la base de datos
  - Datos de ejemplo realistas para simulación logística
  - Usuarios demo con contraseñas hasheadas

### 3. Acceder al Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/api/health

## Usuarios Demo

| Email | Password | Rol | Permisos |
|---|---|---|---|---|
| admin@logistica.com | admin123 | Administrador | Acceso total, gestión de usuarios, configuración, auditoría, backups |
| operador@logistica.com | oper123 | Operador Logístico | CRUDs operativos (proveedores, productos, compras, costes, distribución) |
| supervisor@logistica.com | sup123 | Supervisor | Lectura + gestión de estados/alertas + auditoría |
| gerente@logistica.com | ger123 | Gerente | Lectura, dashboard, reportes, configuración de alertas |

## Datos de Ejemplo Precargados (Plaza Vea - Supermercado)

El sistema incluye datos realistas para simular un proceso logístico completo de Plaza Vea:

### Proveedores (8)
- Proveedores de productos de consumo: Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson
- Contactos y ubicaciones en Lima y principales ciudades

### Productos (15)
- Productos de supermercado: arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante
- Precios unitarios y stock mínimo configurados

### Centros de Distribución (5)
- Trujillo, Chiclayo, Lima Central, Arequipa, Piura
- Capacidad y costes operativos mensuales realistas para supermercado

### Vehículos (8)
- Flota Plaza Vea: camiones refrigerados y de distribución (3.5T a 22T)
- Marcas: Volvo, Hino, Mercedes, Scania, Iveco, MAN
- Coste por km configurado

### Órdenes de Compra (6)
- Estados variados: pendiente, en almacén, en tránsito, entregado
- Detalles de productos de consumo y cantidades
- Fechas de emisión y entrega esperada

### Costes de Almacenamiento (15 registros)
- Alquiler mensual por centro de distribución
- Mantenimiento de cámaras frigoríficas, servicios, mano de obra
- Referencias operativas

### Costes de Transporte (10 registros)
- Rutas entre centros de distribución (Lima-Trujillo-Arequipa-Chiclayo-Piura)
- Combustible, peajes, mantenimiento, conductor
- Kilometraje y costes totales

### Distribuciones (6)
- Asignación de vehículos Plaza Vea a órdenes de compra
- Estados: pendiente, en almacén, en tránsito, entregado
- Fechas de salida y entrega

### Alertas de Sobrecostes (5)
- Tipos: transporte, almacenamiento, compra
- Estados: activa, revisada
- Porcentaje de exceso calculado

## Flujo de Trabajo Sugerido

### 1. Explorar el Dashboard
- Ver KPIs ejecutivos
- Costes totales mensuales
- Alertas activas
- Top productos por coste

### 2. Gestionar Proveedores
- Revisar proveedores existentes
- Agregar nuevos proveedores
- Actualizar información de contacto

### 3. Administrar Inventario
- Ver stock actual por almacén
- Identificar productos con bajo stock
- Realizar ajustes de inventario

### 4. Registrar Órdenes de Compra
- Crear nueva orden de compra
- Agregar productos y cantidades
- Asignar almacén de destino
- Seguir estado del pedido

### 5. Registrar Costes
- Costes de almacenamiento (alquiler, mantenimiento, etc.)
- Costes de transporte (combustible, peajes, etc.)
- Ver cálculo automático de costes totales

### 6. Gestionar Distribuciones
- Asignar vehículos a órdenes de compra
- Registrar fechas de salida y entrega
- Actualizar estados de distribución

### 7. Revisar Alertas
- Ver alertas de sobrecostes activas
- Investigar diferencias de coste
- Actualizar estado de alertas

### 8. Generar Reportes
- Exportar reportes PDF/Excel
- Ver resumen financiero ejecutivo
- Analizar tendencias de costes

## Detener el Sistema

```bash
docker-compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker-compose down -v
```

## Desarrollo Local

Si prefieres desarrollar sin Docker:

### Backend
```bash
cd backend
cp .env.example .env
# Ajustar credenciales de PostgreSQL local
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Solución de Problemas

### PostgreSQL no inicia (error de locales)
El docker-compose.yml ya incluye la corrección:
```yaml
environment:
  LANG: C.UTF-8
  LC_ALL: C.UTF-8
```

### Puertos ya en uso
Si los puertos 4000, 5173 o 5432 están ocupados, modifica el docker-compose.yml:
```yaml
ports:
  - "NUEVO_PUERTO:4000"  # Backend
  - "NUEVO_PUERTO:5173"  # Frontend
  - "NUEVO_PUERTO:5432"  # PostgreSQL
```

### Reconstruir desde cero
```bash
docker-compose down -v
docker-compose up --build
```

## Soporte

Para problemas o preguntas, consulta el README.md principal o abre un issue en el repositorio.
