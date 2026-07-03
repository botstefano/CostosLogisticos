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
('Nestlé Perú S.A.', 'Carlos Rodríguez', '01-411-9000', 'ventas@nestle.pe', 'Av. Javier Prado Este 5200, Lima'),
('Gloria S.A.', 'María Fernández', '01-617-8000', 'contacto@gloria.com.pe', 'Av. Industrial 850, Lima'),
('Backus y Johnston S.A.A.', 'Jorge Mendoza', '01-313-5000', 'ventas@backus.com.pe', 'Jr. Conquistadores 199, Lima'),
('P&G Perú', 'Ana García', '01-705-8000', 'info@pg.com', 'Av. Brasil 2460, Lima'),
('Unilever Andina Perú', 'Roberto Sánchez', '01-615-7000', 'contacto@unilever.com.pe', 'Av. Panamericana Norte 1250, Lima'),
('Alicorp S.A.A.', 'Pedro Torres', '01-617-6000', 'ventas@alicorp.com.pe', 'Av. Los Héroes 2690, Lima'),
('Pepsico Perú', 'Carmen López', '01-411-7000', 'info@pepsico.com', 'Av. Principal 450, Lima'),
('Johnson & Johnson Perú', 'Luis Castro', '01-705-6000', 'contacto@jj.com.pe', 'Av. Salaverry 3500, Lima');

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
('Arroz Costeño Premium 1kg', 'Arroz blanco premium bolsa 1kg', 4.50, 2000, 500, 6),
('Fideos Don Vittorio 500g', 'Fideos espagueti paquete 500g', 2.80, 1500, 300, 6),
('Leche Gloria Entera 1L', 'Leche entera UHT caja 1L', 3.20, 3000, 600, 2),
('Cerveza Cusqueña 6-pack', 'Cerveza lager 330ml x 6 botellas', 18.50, 800, 200, 3),
('Gaseosa Inca Kola 2L', 'Gaseosa personal botella 2L', 4.20, 2500, 500, 3),
('Detergente Ariel 1kg', 'Detergente en polvo bolsa 1kg', 12.90, 1200, 250, 4),
('Jabón Lux 3 unidades', 'Jabón de tocador pack 3 unidades', 8.50, 1800, 400, 4),
('Aceite Girasol La Favorita 1L', 'Aceite vegetal botella 1L', 7.80, 2200, 450, 6),
('Azúcar Blanca Peru 1kg', 'Azúcar refinada bolsa 1kg', 3.20, 3500, 700, 6),
('Café Altomayo 250g', 'Café tostado molido paquete 250g', 15.90, 900, 200, 1),
('Atún Dolores 140g', 'Atún en agua lata 140g', 5.50, 2800, 550, 1),
('Galletas Oreo 150g', 'Galletas con relleno paquete 150g', 4.80, 1600, 320, 1),
('Shampoo Sedal 400ml', 'Shampoo anti-caída botella 400ml', 9.90, 1400, 280, 4),
('Pasta Dental Colgate 100ml', 'Pasta dental tubo 100ml', 6.50, 1900, 380, 4),
('Desodorante Rexona 50ml', 'Desodorante roll-on 50ml', 8.20, 1700, 340, 4);

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
('CD Plaza Vea Trujillo', 'Av. Industrial 1200, Trujillo', 15000.00, 25000.00),
('CD Plaza Vea Chiclayo', 'Carretera Panamericana Norte Km 5, Chiclayo', 12000.00, 20000.00),
('CD Plaza Vea Lima Central', 'Av. Panamericana Norte 2500, Lima', 25000.00, 45000.00),
('CD Plaza Vea Arequipa', 'Av. Industrial 800, Arequipa', 10000.00, 18000.00),
('CD Plaza Vea Piura', 'Av. Grau 450, Piura', 9000.00, 16000.00);

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
(1, 1, 500, 'A-01-01'),
(1, 2, 400, 'B-02-01'),
(1, 3, 800, 'C-01-05'),
(2, 1, 350, 'A-02-01'),
(2, 2, 300, 'B-01-03'),
(2, 3, 500, 'C-02-02'),
(3, 1, 600, 'A-01-05'),
(3, 2, 500, 'B-02-02'),
(3, 3, 1200, 'C-03-01'),
(4, 1, 200, 'A-03-01'),
(4, 3, 400, 'C-04-02'),
(5, 1, 500, 'A-01-02'),
(5, 2, 450, 'B-03-01'),
(5, 3, 900, 'C-05-01'),
(6, 1, 300, 'A-04-01'),
(6, 3, 500, 'C-06-02'),
(7, 2, 400, 'B-04-01'),
(7, 3, 600, 'C-07-01'),
(8, 1, 350, 'A-05-01'),
(8, 3, 550, 'C-08-02'),
(9, 2, 700, 'B-05-01'),
(9, 4, 600, 'D-01-01'),
(10, 1, 200, 'A-06-01'),
(10, 3, 350, 'C-09-02'),
(11, 2, 300, 'B-06-01'),
(11, 4, 250, 'D-02-01'),
(12, 1, 800, 'A-07-01'),
(12, 3, 1000, 'C-10-02'),
(13, 2, 350, 'B-07-01'),
(13, 4, 300, 'D-03-01'),
(14, 1, 450, 'A-08-01'),
(14, 3, 600, 'C-11-02'),
(15, 2, 300, 'B-08-01'),
(15, 4, 250, 'D-04-01');

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
(6, '2026-05-01', '2026-05-10', '2026-05-09', 12500.00, 'entregado', 2, 1),
(2, '2026-05-05', '2026-05-15', '2026-05-16', 8900.00, 'entregado', 2, 2),
(3, '2026-05-15', '2026-05-25', NULL, 15600.00, 'en transito', 2, 3),
(4, '2026-06-01', '2026-06-12', NULL, 18500.00, 'pendiente', 2, 1),
(5, '2026-06-05', '2026-06-18', NULL, 14200.00, 'pendiente', 2, 4),
(6, '2026-06-08', '2026-06-20', NULL, 11000.00, 'en almacen', 2, 2);

-- Datos de ejemplo: Detalles de compra
INSERT INTO detalles_compra (orden_compra_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1000, 4.50, 4500.00),
(1, 2, 800, 2.80, 2240.00),
(1, 8, 500, 7.80, 3900.00),
(2, 3, 1500, 3.20, 4800.00),
(2, 9, 800, 3.20, 2560.00),
(2, 5, 300, 4.20, 1260.00),
(3, 4, 400, 18.50, 7400.00),
(3, 5, 500, 4.20, 2100.00),
(3, 6, 400, 12.90, 5160.00),
(4, 7, 600, 8.50, 5100.00),
(4, 10, 500, 15.90, 7950.00),
(4, 11, 400, 5.50, 2200.00),
(5, 12, 500, 9.90, 4950.00),
(5, 13, 600, 6.50, 3900.00),
(5, 14, 400, 8.20, 3280.00),
(6, 1, 800, 4.50, 3600.00),
(6, 8, 500, 7.80, 3900.00),
(6, 9, 700, 3.20, 2240.00);

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
(1, '2026-05-01', 'Alquiler mensual mayo CD Trujillo', 25000.00, 'alquiler', 'ALQ-2026-05-01', 2),
(1, '2026-05-15', 'Mantenimiento de cámaras frigoríficas', 1200.00, 'mantenimiento', 'MANT-001', 2),
(1, '2026-05-20', 'Servicios básicos (agua/luz)', 1800.00, 'servicios', 'SERV-001', 2),
(2, '2026-05-01', 'Alquiler mensual mayo CD Chiclayo', 20000.00, 'alquiler', 'ALQ-2026-05-02', 2),
(2, '2026-05-10', 'Reparación de estanterías metálicas', 850.00, 'mantenimiento', 'MANT-002', 2),
(3, '2026-05-01', 'Alquiler mensual mayo CD Lima', 45000.00, 'alquiler', 'ALQ-2026-05-03', 2),
(3, '2026-05-12', 'Servicios de seguridad 24/7', 3500.00, 'servicios', 'SERV-002', 2),
(4, '2026-05-01', 'Alquiler mensual mayo CD Arequipa', 18000.00, 'alquiler', 'ALQ-2026-05-04', 2),
(4, '2026-05-18', 'Mano de obra extra temporada', 1500.00, 'mano_obra', 'MO-001', 2),
(5, '2026-05-01', 'Alquiler mensual mayo CD Piura', 16000.00, 'alquiler', 'ALQ-2026-05-05', 2),
(1, '2026-06-01', 'Alquiler mensual junio CD Trujillo', 25000.00, 'alquiler', 'ALQ-2026-06-01', 2),
(2, '2026-06-01', 'Alquiler mensual junio CD Chiclayo', 20000.00, 'alquiler', 'ALQ-2026-06-02', 2),
(3, '2026-06-01', 'Alquiler mensual junio CD Lima', 45000.00, 'alquiler', 'ALQ-2026-06-03', 2),
(4, '2026-06-01', 'Alquiler mensual junio CD Arequipa', 18000.00, 'alquiler', 'ALQ-2026-06-04', 2),
(5, '2026-06-01', 'Alquiler mensual junio CD Piura', 16000.00, 'alquiler', 'ALQ-2026-06-05', 2);

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
('PV-1001', 'Volvo FH 16 - Camión refrigerado Plaza Vea', 12000.00, 2.85),
('PV-1002', 'Hino 500 - Camión mediano Plaza Vea', 6000.00, 1.95),
('PV-1003', 'Mercedes-Benz Actros - Camión grande Plaza Vea', 15000.00, 3.20),
('PV-1004', 'Scania R450 - Camión articulado Plaza Vea', 18000.00, 3.50),
('PV-1005', 'Iveco Eurocargo - Camión ligero Plaza Vea', 3500.00, 1.45),
('PV-1006', 'MAN TGS - Camión pesado Plaza Vea', 22000.00, 3.80),
('PV-1007', 'Volvo FM - Camión distribución Plaza Vea', 8000.00, 2.20),
('PV-1008', 'Mercedes-Benz Atego - Camión urbano Plaza Vea', 5000.00, 1.80);

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
(1, '2026-05-02', 'CD Lima', 'CD Trujillo', 560.00, 1200.00, 150.00, 80.00, 350.00, 1780.00, 'TRANS-001', 2),
(2, '2026-05-05', 'CD Trujillo', 'CD Chiclayo', 210.00, 450.00, 60.00, 40.00, 180.00, 730.00, 'TRANS-002', 2),
(3, '2026-05-08', 'CD Lima', 'CD Arequipa', 850.00, 1800.00, 220.00, 120.00, 450.00, 2590.00, 'TRANS-003', 2),
(1, '2026-05-12', 'CD Trujillo', 'CD Lima', 560.00, 1150.00, 150.00, 85.00, 350.00, 1735.00, 'TRANS-004', 2),
(4, '2026-05-15', 'CD Arequipa', 'CD Lima', 850.00, 1950.00, 220.00, 130.00, 500.00, 2800.00, 'TRANS-005', 2),
(5, '2026-05-18', 'CD Trujillo', 'CD Piura', 200.00, 380.00, 50.00, 35.00, 150.00, 615.00, 'TRANS-006', 2),
(6, '2026-05-20', 'CD Lima', 'CD Arequipa', 850.00, 2100.00, 220.00, 140.00, 550.00, 3010.00, 'TRANS-007', 2),
(2, '2026-05-22', 'CD Piura', 'CD Trujillo', 200.00, 360.00, 50.00, 38.00, 140.00, 588.00, 'TRANS-008', 2),
(3, '2026-05-25', 'CD Trujillo', 'CD Lima', 560.00, 1280.00, 150.00, 95.00, 400.00, 1925.00, 'TRANS-009', 2),
(1, '2026-05-28', 'CD Lima', 'CD Trujillo', 560.00, 1180.00, 150.00, 90.00, 350.00, 1770.00, 'TRANS-010', 2);

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
(1, 1, '2026-05-02 08:00:00', '2026-05-09 16:30:00', 'entregado', 1780.00),
(2, 2, '2026-05-05 09:30:00', '2026-05-16 14:45:00', 'entregado', 730.00),
(3, 3, '2026-05-20 07:00:00', NULL, 'en transito', 2590.00),
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
('2026-05-15 10:30:00', 'transporte', 'TRANS-003', 2300.00, 2590.00, 290.00, 12.61, 'revisada'),
('2026-05-20 14:45:00', 'almacenamiento', 'MANT-002', 1000.00, 1200.00, 200.00, 20.00, 'activa'),
('2026-05-25 09:15:00', 'transporte', 'TRANS-007', 2700.00, 3010.00, 310.00, 11.48, 'activa'),
('2026-06-01 11:00:00', 'compra', 'OC-004', 17000.00, 18500.00, 1500.00, 8.82, 'activa'),
('2026-06-05 16:20:00', 'almacenamiento', 'MO-001', 1300.00, 1500.00, 200.00, 15.38, 'activa');

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
('compra', 10.00, 150000.00),
('almacenamiento', 10.00, 124000.00),
('transporte', 15.00, 85000.00),
('distribucion', 15.00, 45000.00),
('general', 10.00, 404000.00);

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
