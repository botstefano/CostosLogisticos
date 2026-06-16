-- =====================================================================
-- SISTEMA DE GESTIÓN Y CONTROL DE COSTES LOGÍSTICOS
-- Schema PostgreSQL + Datos de ejemplo
-- =====================================================================

DROP TABLE IF EXISTS auditorias CASCADE;
DROP TABLE IF EXISTS alertas_sobrecostes CASCADE;
DROP TABLE IF EXISTS costes_logisticos_totales CASCADE;
DROP TABLE IF EXISTS distribuciones CASCADE;
DROP TABLE IF EXISTS costes_transporte CASCADE;
DROP TABLE IF EXISTS vehiculos CASCADE;
DROP TABLE IF EXISTS costes_almacenamiento CASCADE;
DROP TABLE IF EXISTS detalles_compra CASCADE;
DROP TABLE IF EXISTS ordenes_compra CASCADE;
DROP TABLE IF EXISTS inventarios CASCADE;
DROP TABLE IF EXISTS almacenes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS configuracion_alertas CASCADE;

-- =====================================================================
-- 1. ROLES
-- =====================================================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema, gestión de usuarios y configuración'),
('Operador Logistico', 'Registro de operaciones diarias: compras, costes, inventario, transporte'),
('Supervisor', 'Supervisión de operaciones, validación de registros y alertas'),
('Gerente', 'Acceso a dashboards ejecutivos, reportes y KPIs financieros');

-- =====================================================================
-- 2. USUARIOS
-- =====================================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contraseñas (bcrypt, costo 10):
-- admin123     -> $2b$10$VYqB1y1c1f8f0r5b4f1F.uQwQyqkqkVQ0YV9bC5kQYV0V1m2t4Q8e  (placeholder, generado en seed.js)
-- Se insertan vía seed.js para generar hashes reales. Aquí dejamos placeholders.
INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES
('Administrador Sistema', 'admin@logistica.com', '__HASH_ADMIN__', 1),
('Operador Logistico', 'operador@logistica.com', '__HASH_OPERADOR__', 2),
('Supervisor General', 'supervisor@logistica.com', '__HASH_SUPERVISOR__', 3),
('Gerente General', 'gerente@logistica.com', '__HASH_GERENTE__', 4);

-- =====================================================================
-- 3. PROVEEDORES
-- =====================================================================
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(150),
    telefono VARCHAR(30),
    email VARCHAR(150),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora del Norte S.A.', 'Carlos Méndez', '044-123456', 'ventas@distnorte.com', 'Av. Industrial 450, Trujillo'),
('Importadora Pacífico SAC', 'Lucía Ramos', '044-654321', 'contacto@impacifico.com', 'Jr. Comercio 220, Trujillo'),
('Suministros Andinos EIRL', 'Jorge Salazar', '044-789012', 'info@suministrosandinos.com', 'Calle Los Pinos 88, La Esperanza'),
('Logística Global Perú', 'María González', '01-5551234', 'contacto@logisticaglobal.pe', 'Av. Panamericana Norte 1234, Lima'),
('Transportes Rápidos SAC', 'Roberto Sánchez', '01-4445678', 'ventas@transportesrapidos.pe', 'Jr. Industrial 567, Lima'),
('Empaques Modernos EIRL', 'Ana Torres', '044-333999', 'info@empaquesmodernos.com', 'Av. Los Libertadores 890, Trujillo'),
('Materiales Industriales del Sur', 'Pedro Castillo', '054-777888', 'ventas@materialessur.com', 'Av. Grau 456, Arequipa'),
('Suministros Logísticos Integrales', 'Carmen López', '01-6667777', 'contacto@suministroslogisticos.pe', 'Av. Brasil 321, Lima');

-- =====================================================================
-- 4. PRODUCTOS
-- =====================================================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_unitario NUMERIC(12,2) NOT NULL DEFAULT 0,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    proveedor_id INTEGER REFERENCES proveedores(id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, proveedor_id) VALUES
('Caja de cartón corrugado 40x30x30', 'Caja estándar para embalaje', 3.50, 500, 100, 1),
('Pallet de madera estándar', 'Pallet 1.2x1.0m capacidad 1000kg', 45.00, 80, 20, 2),
('Film stretch industrial', 'Rollo de film para paletizado, 500m', 18.90, 150, 30, 1),
('Etiquetas térmicas autoadhesivas', 'Rollo de 1000 etiquetas para impresora térmica', 12.00, 200, 50, 3),
('Cinta de embalaje reforzada', 'Cinta adhesiva 48mm x 100m', 4.20, 300, 60, 3),
('Contenedor plástico 600x400mm', 'Contenedor apilable para almacenamiento', 25.00, 400, 80, 4),
('Fleje de acero 19mm', 'Rollo de fleje para sujeción de cargas', 8.50, 250, 50, 5),
('Protectores de esquina', 'Protectores de cartón para pallets (pack 100)', 15.00, 180, 40, 6),
('Film retráctil manual', 'Rollo de film retráctil 20 micras x 500m', 22.00, 120, 30, 7),
('Tarima plática reforzada', 'Tarima plástica 1200x1000mm capacidad 1500kg', 85.00, 60, 15, 8),
('Caja telescópica grande', 'Caja ajustable para productos grandes', 12.50, 200, 40, 1),
('Bolsa de polietileno 50x70cm', 'Bolsa resistente para embalaje (pack 500)', 8.00, 600, 120, 2),
('Relleno de burbuja 50m', 'Rollo de plástico de burbuja para protección', 16.00, 150, 30, 3),
('Precinto de seguridad', 'Precintos numerados alta seguridad (pack 100)', 35.00, 300, 60, 4),
('Contenedor metálico 800x600mm', 'Contenedor metálico resistente para almacenamiento', 120.00, 40, 10, 5);

-- =====================================================================
-- 5. ALMACENES
-- =====================================================================
CREATE TABLE almacenes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ubicacion VARCHAR(255),
    capacidad_total NUMERIC(12,2),
    coste_mensual_operacion NUMERIC(12,2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO almacenes (nombre, ubicacion, capacidad_total, coste_mensual_operacion) VALUES
('Almacén Central Trujillo', 'Av. Industrial 1200, Trujillo', 5000.00, 8500.00),
('Almacén Norte La Esperanza', 'Carretera Industrial Km 5, La Esperanza', 3000.00, 5200.00),
('Centro de Distribución Lima', 'Av. Panamericana Norte 2500, Lima', 8000.00, 12500.00),
('Almacén Sur Arequipa', 'Av. Industrial 800, Arequipa', 4000.00, 7800.00);

-- =====================================================================
-- 6. INVENTARIOS
-- =====================================================================
CREATE TABLE inventarios (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    almacen_id INTEGER NOT NULL REFERENCES almacenes(id),
    cantidad INTEGER NOT NULL DEFAULT 0,
    ubicacion_estanteria VARCHAR(50),
    ultima_actualizacion TIMESTAMP DEFAULT NOW(),
    UNIQUE(producto_id, almacen_id)
);

INSERT INTO inventarios (producto_id, almacen_id, cantidad, ubicacion_estanteria) VALUES
(1, 1, 300, 'A-01-01'),
(1, 2, 200, 'B-02-01'),
(1, 3, 450, 'C-01-05'),
(2, 1, 50, 'A-02-01'),
(2, 2, 30, 'B-01-03'),
(2, 3, 120, 'C-02-02'),
(3, 1, 100, 'A-01-05'),
(3, 2, 50, 'B-02-02'),
(3, 3, 200, 'C-03-01'),
(4, 1, 200, 'A-03-01'),
(4, 3, 350, 'C-04-02'),
(5, 1, 150, 'A-01-02'),
(5, 2, 150, 'B-03-01'),
(5, 3, 280, 'C-05-01'),
(6, 1, 250, 'A-04-01'),
(6, 3, 380, 'C-06-02'),
(7, 2, 180, 'B-04-01'),
(7, 3, 220, 'C-07-01'),
(8, 1, 150, 'A-05-01'),
(8, 3, 200, 'C-08-02'),
(9, 2, 100, 'B-05-01'),
(9, 4, 80, 'D-01-01'),
(10, 1, 40, 'A-06-01'),
(10, 3, 60, 'C-09-02'),
(11, 2, 150, 'B-06-01'),
(11, 4, 120, 'D-02-01'),
(12, 1, 400, 'A-07-01'),
(12, 3, 550, 'C-10-02'),
(13, 2, 120, 'B-07-01'),
(13, 4, 100, 'D-03-01'),
(14, 1, 250, 'A-08-01'),
(14, 3, 300, 'C-11-02'),
(15, 2, 30, 'B-08-01'),
(15, 4, 25, 'D-04-01');

-- =====================================================================
-- 7. ÓRDENES DE COMPRA
-- =====================================================================
CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    proveedor_id INTEGER NOT NULL REFERENCES proveedores(id),
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_entrega_esperada DATE,
    fecha_entrega_real DATE,
    total NUMERIC(14,2) DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente','en almacen','en transito','entregado','cancelado')),
    usuario_registra_id INTEGER REFERENCES usuarios(id),
    almacen_destino_id INTEGER REFERENCES almacenes(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================
-- 8. DETALLES DE COMPRA
-- =====================================================================
CREATE TABLE detalles_compra (
    id SERIAL PRIMARY KEY,
    orden_compra_id INTEGER NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL
);

-- Datos de ejemplo: Órdenes de compra
INSERT INTO ordenes_compra (proveedor_id, fecha_emision, fecha_entrega_esperada, fecha_entrega_real, total, estado, usuario_registra_id, almacen_destino_id) VALUES
(1, '2026-05-01', '2026-05-15', '2026-05-14', 4500.00, 'entregado', 2, 1),
(2, '2026-05-10', '2026-05-25', '2026-05-26', 3200.00, 'entregado', 2, 2),
(3, '2026-05-20', '2026-06-05', NULL, 2800.00, 'en transito', 2, 3),
(4, '2026-06-01', '2026-06-15', NULL, 5100.00, 'pendiente', 2, 1),
(5, '2026-06-05', '2026-06-20', NULL, 3900.00, 'pendiente', 2, 4),
(1, '2026-06-08', '2026-06-22', NULL, 4200.00, 'en almacen', 2, 2);

-- Datos de ejemplo: Detalles de compra
INSERT INTO detalles_compra (orden_compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 500, 3.50, 1750.00),
(1, 3, 150, 18.90, 2835.00),
(2, 2, 40, 45.00, 1800.00),
(2, 5, 333, 4.20, 1400.00),
(3, 6, 80, 25.00, 2000.00),
(3, 7, 94, 8.50, 800.00),
(4, 8, 120, 15.00, 1800.00),
(4, 9, 150, 22.00, 3300.00),
(5, 10, 30, 85.00, 2550.00),
(5, 11, 108, 12.50, 1350.00),
(6, 12, 300, 8.00, 2400.00),
(6, 13, 100, 16.00, 1600.00),
(6, 14, 20, 35.00, 700.00);

-- =====================================================================
-- 9. COSTES DE ALMACENAMIENTO
-- =====================================================================
CREATE TABLE costes_almacenamiento (
    id SERIAL PRIMARY KEY,
    almacen_id INTEGER NOT NULL REFERENCES almacenes(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    concepto VARCHAR(150) NOT NULL,
    monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
    tipo_gasto VARCHAR(50) NOT NULL
        CHECK (tipo_gasto IN ('alquiler','mantenimiento','mano_obra','servicios','otros')),
    operacion_referencia VARCHAR(100),
    usuario_registra_id INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo: Costes de almacenamiento
INSERT INTO costes_almacenamiento (almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia, usuario_registra_id) VALUES
(1, '2026-05-01', 'Alquiler mensual mayo', 8500.00, 'alquiler', 'ALQ-2026-05-01', 2),
(1, '2026-05-15', 'Mantenimiento de montacargas', 450.00, 'mantenimiento', 'MANT-001', 2),
(1, '2026-05-20', 'Servicios básicos (agua/luz)', 680.00, 'servicios', 'SERV-001', 2),
(2, '2026-05-01', 'Alquiler mensual mayo', 5200.00, 'alquiler', 'ALQ-2026-05-02', 2),
(2, '2026-05-10', 'Reparación de estanterías', 320.00, 'mantenimiento', 'MANT-002', 2),
(3, '2026-05-01', 'Alquiler mensual mayo', 12500.00, 'alquiler', 'ALQ-2026-05-03', 2),
(3, '2026-05-12', 'Servicios de seguridad', 1200.00, 'servicios', 'SERV-002', 2),
(4, '2026-05-01', 'Alquiler mensual mayo', 7800.00, 'alquiler', 'ALQ-2026-05-04', 2),
(4, '2026-05-18', 'Mano de obra extra', 850.00, 'mano_obra', 'MO-001', 2),
(1, '2026-06-01', 'Alquiler mensual junio', 8500.00, 'alquiler', 'ALQ-2026-06-01', 2),
(2, '2026-06-01', 'Alquiler mensual junio', 5200.00, 'alquiler', 'ALQ-2026-06-02', 2),
(3, '2026-06-01', 'Alquiler mensual junio', 12500.00, 'alquiler', 'ALQ-2026-06-03', 2),
(4, '2026-06-01', 'Alquiler mensual junio', 7800.00, 'alquiler', 'ALQ-2026-06-04', 2);

-- =====================================================================
-- 10. VEHÍCULOS
-- =====================================================================
CREATE TABLE vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    modelo VARCHAR(100),
    capacidad_carga NUMERIC(10,2),
    coste_por_km NUMERIC(10,2) DEFAULT 0,
    estado VARCHAR(30) DEFAULT 'disponible'
        CHECK (estado IN ('disponible','en ruta','mantenimiento','inactivo')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO vehiculos (placa, modelo, capacidad_carga, coste_por_km) VALUES
('T1A-123', 'Volvo FH 16 - Camión de carga', 12000.00, 2.85),
('T2B-456', 'Hino 500 - Camión mediano', 6000.00, 1.95),
('T3C-789', 'Mercedes-Benz Actros - Camión grande', 15000.00, 3.20),
('T4D-012', 'Scania R450 - Camión articulado', 18000.00, 3.50),
('T5E-345', 'Iveco Eurocargo - Camión ligero', 3500.00, 1.45),
('T6F-678', 'MAN TGS - Camión pesado', 22000.00, 3.80);

-- =====================================================================
-- 11. COSTES DE TRANSPORTE
-- =====================================================================
CREATE TABLE costes_transporte (
    id SERIAL PRIMARY KEY,
    vehiculo_id INTEGER NOT NULL REFERENCES vehiculos(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    ruta_origen VARCHAR(150),
    ruta_destino VARCHAR(150),
    kilometros_recorridos NUMERIC(10,2) NOT NULL DEFAULT 0,
    coste_combustible NUMERIC(12,2) DEFAULT 0,
    coste_peajes NUMERIC(12,2) DEFAULT 0,
    coste_mantenimiento NUMERIC(12,2) DEFAULT 0,
    coste_conductor NUMERIC(12,2) DEFAULT 0,
    coste_total NUMERIC(14,2) DEFAULT 0,
    operacion_referencia VARCHAR(100),
    usuario_registra_id INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo: Costes de transporte
INSERT INTO costes_transporte (vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos, coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor, coste_total, operacion_referencia, usuario_registra_id) VALUES
(1, '2026-05-02', 'Trujillo', 'Lima', 560.00, 850.00, 120.00, 50.00, 200.00, 1220.00, 'TRANS-001', 2),
(2, '2026-05-05', 'Lima', 'Trujillo', 560.00, 680.00, 120.00, 40.00, 180.00, 1020.00, 'TRANS-002', 2),
(3, '2026-05-08', 'Trujillo', 'Arequipa', 850.00, 1350.00, 180.00, 80.00, 280.00, 1890.00, 'TRANS-003', 2),
(1, '2026-05-12', 'Lima', 'Trujillo', 560.00, 820.00, 120.00, 55.00, 200.00, 1195.00, 'TRANS-004', 2),
(4, '2026-05-15', 'Arequipa', 'Lima', 850.00, 1480.00, 180.00, 90.00, 320.00, 2070.00, 'TRANS-005', 2),
(5, '2026-05-18', 'Trujillo', 'Chiclayo', 210.00, 280.00, 45.00, 25.00, 80.00, 430.00, 'TRANS-006', 2),
(6, '2026-05-20', 'Lima', 'Arequipa', 850.00, 1650.00, 180.00, 100.00, 350.00, 2280.00, 'TRANS-007', 2),
(2, '2026-05-22', 'Chiclayo', 'Trujillo', 210.00, 260.00, 45.00, 30.00, 75.00, 410.00, 'TRANS-008', 2),
(3, '2026-05-25', 'Trujillo', 'Lima', 560.00, 920.00, 120.00, 70.00, 250.00, 1360.00, 'TRANS-009', 2),
(1, '2026-05-28', 'Lima', 'Trujillo', 560.00, 840.00, 120.00, 60.00, 210.00, 1230.00, 'TRANS-010', 2);

-- =====================================================================
-- 12. DISTRIBUCIONES
-- =====================================================================
CREATE TABLE distribuciones (
    id SERIAL PRIMARY KEY,
    orden_compra_id INTEGER REFERENCES ordenes_compra(id),
    vehiculo_id INTEGER REFERENCES vehiculos(id),
    fecha_salida TIMESTAMP,
    fecha_entrega TIMESTAMP,
    estado VARCHAR(30) DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente','en almacen','en transito','entregado','cancelado')),
    coste_total_transporte NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo: Distribuciones
INSERT INTO distribuciones (orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, estado, coste_total_transporte) VALUES
(1, 1, '2026-05-02 08:00:00', '2026-05-14 16:30:00', 'entregado', 1220.00),
(2, 2, '2026-05-05 09:30:00', '2026-05-26 14:45:00', 'entregado', 1020.00),
(3, 3, '2026-05-20 07:00:00', NULL, 'en transito', 1890.00),
(4, 4, NULL, NULL, 'pendiente', 0.00),
(5, 5, NULL, NULL, 'pendiente', 0.00),
(6, 6, '2026-06-08 10:00:00', NULL, 'en almacen', 0.00);

-- =====================================================================
-- 13. COSTES LOGÍSTICOS TOTALES
-- =====================================================================
CREATE TABLE costes_logisticos_totales (
    id SERIAL PRIMARY KEY,
    operacion_referencia VARCHAR(100) NOT NULL,
    tipo_operacion VARCHAR(50) NOT NULL
        CHECK (tipo_operacion IN ('compra','almacenamiento','transporte','distribucion','general')),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    monto_total NUMERIC(14,2) NOT NULL DEFAULT 0,
    desglose_json JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================
-- 14. ALERTAS DE SOBRECOSTES
-- =====================================================================
CREATE TABLE alertas_sobrecostes (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT NOW(),
    tipo VARCHAR(50) NOT NULL,
    operacion_referencia VARCHAR(100),
    monto_esperado NUMERIC(14,2) NOT NULL,
    monto_real NUMERIC(14,2) NOT NULL,
    diferencia NUMERIC(14,2) NOT NULL,
    porcentaje_exceso NUMERIC(6,2),
    estado VARCHAR(30) DEFAULT 'activa'
        CHECK (estado IN ('activa','revisada','resuelta','descartada')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo: Alertas de sobrecostes
INSERT INTO alertas_sobrecostes (fecha, tipo, operacion_referencia, monto_esperado, monto_real, diferencia, porcentaje_exceso, estado) VALUES
('2026-05-15 10:30:00', 'transporte', 'TRANS-003', 1700.00, 1890.00, 190.00, 11.18, 'revisada'),
('2026-05-20 14:45:00', 'almacenamiento', 'MANT-002', 300.00, 320.00, 20.00, 6.67, 'activa'),
('2026-05-25 09:15:00', 'transporte', 'TRANS-007', 2000.00, 2280.00, 280.00, 14.00, 'activa'),
('2026-06-01 11:00:00', 'compra', 'OC-004', 4600.00, 5100.00, 500.00, 10.87, 'activa'),
('2026-06-05 16:20:00', 'almacenamiento', 'MO-001', 750.00, 850.00, 100.00, 13.33, 'activa');

-- Tabla de configuración de umbrales (apoyo para RF12)
CREATE TABLE configuracion_alertas (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) UNIQUE NOT NULL
        CHECK (tipo IN ('compra','almacenamiento','transporte','distribucion','general')),
    umbral_porcentaje NUMERIC(6,2) NOT NULL DEFAULT 10.00,
    monto_presupuestado_mensual NUMERIC(14,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO configuracion_alertas (tipo, umbral_porcentaje, monto_presupuestado_mensual) VALUES
('compra', 10.00, 50000.00),
('almacenamiento', 10.00, 15000.00),
('transporte', 15.00, 12000.00),
('distribucion', 15.00, 8000.00),
('general', 10.00, 85000.00);

-- =====================================================================
-- 15. AUDITORÍAS
-- =====================================================================
CREATE TABLE auditorias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('INSERT','UPDATE','DELETE')),
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id INTEGER,
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    datos_anteriores_json JSONB,
    datos_nuevos_json JSONB
);

-- =====================================================================
-- ÍNDICES PARA RENDIMIENTO
-- =====================================================================
CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX idx_inventarios_producto ON inventarios(producto_id);
CREATE INDEX idx_inventarios_almacen ON inventarios(almacen_id);
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_estado ON ordenes_compra(estado);
CREATE INDEX idx_detalles_orden ON detalles_compra(orden_compra_id);
CREATE INDEX idx_costes_almacen_fecha ON costes_almacenamiento(almacen_id, fecha);
CREATE INDEX idx_costes_transporte_fecha ON costes_transporte(vehiculo_id, fecha);
CREATE INDEX idx_costes_totales_ref ON costes_logisticos_totales(operacion_referencia);
CREATE INDEX idx_alertas_estado ON alertas_sobrecostes(estado);
CREATE INDEX idx_auditorias_tabla ON auditorias(tabla_afectada, registro_id);

-- =====================================================================
-- TRIGGERS: actualizar updated_at automáticamente
-- =====================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_proveedores BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_productos BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_almacenes BEFORE UPDATE ON almacenes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_ordenes BEFORE UPDATE ON ordenes_compra FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_vehiculos BEFORE UPDATE ON vehiculos FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_distribuciones BEFORE UPDATE ON distribuciones FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
