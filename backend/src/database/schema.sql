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
('Suministros Andinos EIRL', 'Jorge Salazar', '044-789012', 'info@suministrosandinos.com', 'Calle Los Pinos 88, La Esperanza');

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
('Cinta de embalaje reforzada', 'Cinta adhesiva 48mm x 100m', 4.20, 300, 60, 3);

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
('Almacén Norte La Esperanza', 'Carretera Industrial Km 5, La Esperanza', 3000.00, 5200.00);

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
(2, 1, 50, 'A-02-01'),
(2, 2, 30, 'B-01-03'),
(3, 1, 100, 'A-01-05'),
(3, 2, 50, 'B-02-02'),
(4, 1, 200, 'A-03-01'),
(5, 1, 150, 'A-01-02'),
(5, 2, 150, 'B-03-01');

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
('T2B-456', 'Hino 500 - Camión mediano', 6000.00, 1.95);

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
