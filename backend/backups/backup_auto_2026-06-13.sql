--
-- PostgreSQL database dump
--

\restrict jry3aLQfRg4OCWA5aSfc1JrpiCTSpzTY5LZUqrvmoDvXc4WERax45K8wBSB3Fwi

-- Dumped from database version 16.14
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alertas_sobrecostes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alertas_sobrecostes (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    tipo character varying(50) NOT NULL,
    operacion_referencia character varying(100),
    monto_esperado numeric(14,2) NOT NULL,
    monto_real numeric(14,2) NOT NULL,
    diferencia numeric(14,2) NOT NULL,
    porcentaje_exceso numeric(6,2),
    estado character varying(30) DEFAULT 'activa'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT alertas_sobrecostes_estado_check CHECK (((estado)::text = ANY ((ARRAY['activa'::character varying, 'revisada'::character varying, 'resuelta'::character varying, 'descartada'::character varying])::text[])))
);


ALTER TABLE public.alertas_sobrecostes OWNER TO postgres;

--
-- Name: alertas_sobrecostes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alertas_sobrecostes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alertas_sobrecostes_id_seq OWNER TO postgres;

--
-- Name: alertas_sobrecostes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alertas_sobrecostes_id_seq OWNED BY public.alertas_sobrecostes.id;


--
-- Name: almacenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.almacenes (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    ubicacion character varying(255),
    capacidad_total numeric(12,2),
    coste_mensual_operacion numeric(12,2) DEFAULT 0,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.almacenes OWNER TO postgres;

--
-- Name: almacenes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.almacenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.almacenes_id_seq OWNER TO postgres;

--
-- Name: almacenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.almacenes_id_seq OWNED BY public.almacenes.id;


--
-- Name: auditorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditorias (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(50) NOT NULL,
    tabla_afectada character varying(100) NOT NULL,
    registro_id integer,
    fecha_cambio timestamp without time zone DEFAULT now(),
    datos_anteriores_json jsonb,
    datos_nuevos_json jsonb,
    CONSTRAINT auditorias_accion_check CHECK (((accion)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


ALTER TABLE public.auditorias OWNER TO postgres;

--
-- Name: auditorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditorias_id_seq OWNER TO postgres;

--
-- Name: auditorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditorias_id_seq OWNED BY public.auditorias.id;


--
-- Name: configuracion_alertas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_alertas (
    id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    umbral_porcentaje numeric(6,2) DEFAULT 10.00 NOT NULL,
    monto_presupuestado_mensual numeric(14,2) DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT configuracion_alertas_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['compra'::character varying, 'almacenamiento'::character varying, 'transporte'::character varying, 'distribucion'::character varying, 'general'::character varying])::text[])))
);


ALTER TABLE public.configuracion_alertas OWNER TO postgres;

--
-- Name: configuracion_alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_alertas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_alertas_id_seq OWNER TO postgres;

--
-- Name: configuracion_alertas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_alertas_id_seq OWNED BY public.configuracion_alertas.id;


--
-- Name: costes_almacenamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.costes_almacenamiento (
    id integer NOT NULL,
    almacen_id integer NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    concepto character varying(150) NOT NULL,
    monto numeric(12,2) NOT NULL,
    tipo_gasto character varying(50) NOT NULL,
    operacion_referencia character varying(100),
    usuario_registra_id integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT costes_almacenamiento_monto_check CHECK ((monto >= (0)::numeric)),
    CONSTRAINT costes_almacenamiento_tipo_gasto_check CHECK (((tipo_gasto)::text = ANY ((ARRAY['alquiler'::character varying, 'mantenimiento'::character varying, 'mano_obra'::character varying, 'servicios'::character varying, 'otros'::character varying])::text[])))
);


ALTER TABLE public.costes_almacenamiento OWNER TO postgres;

--
-- Name: costes_almacenamiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.costes_almacenamiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.costes_almacenamiento_id_seq OWNER TO postgres;

--
-- Name: costes_almacenamiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.costes_almacenamiento_id_seq OWNED BY public.costes_almacenamiento.id;


--
-- Name: costes_logisticos_totales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.costes_logisticos_totales (
    id integer NOT NULL,
    operacion_referencia character varying(100) NOT NULL,
    tipo_operacion character varying(50) NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    monto_total numeric(14,2) DEFAULT 0 NOT NULL,
    desglose_json jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT costes_logisticos_totales_tipo_operacion_check CHECK (((tipo_operacion)::text = ANY ((ARRAY['compra'::character varying, 'almacenamiento'::character varying, 'transporte'::character varying, 'distribucion'::character varying, 'general'::character varying])::text[])))
);


ALTER TABLE public.costes_logisticos_totales OWNER TO postgres;

--
-- Name: costes_logisticos_totales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.costes_logisticos_totales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.costes_logisticos_totales_id_seq OWNER TO postgres;

--
-- Name: costes_logisticos_totales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.costes_logisticos_totales_id_seq OWNED BY public.costes_logisticos_totales.id;


--
-- Name: costes_transporte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.costes_transporte (
    id integer NOT NULL,
    vehiculo_id integer NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    ruta_origen character varying(150),
    ruta_destino character varying(150),
    kilometros_recorridos numeric(10,2) DEFAULT 0 NOT NULL,
    coste_combustible numeric(12,2) DEFAULT 0,
    coste_peajes numeric(12,2) DEFAULT 0,
    coste_mantenimiento numeric(12,2) DEFAULT 0,
    coste_conductor numeric(12,2) DEFAULT 0,
    coste_total numeric(14,2) DEFAULT 0,
    operacion_referencia character varying(100),
    usuario_registra_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.costes_transporte OWNER TO postgres;

--
-- Name: costes_transporte_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.costes_transporte_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.costes_transporte_id_seq OWNER TO postgres;

--
-- Name: costes_transporte_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.costes_transporte_id_seq OWNED BY public.costes_transporte.id;


--
-- Name: detalles_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_compra (
    id integer NOT NULL,
    orden_compra_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(12,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL,
    CONSTRAINT detalles_compra_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.detalles_compra OWNER TO postgres;

--
-- Name: detalles_compra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_compra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_compra_id_seq OWNER TO postgres;

--
-- Name: detalles_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_compra_id_seq OWNED BY public.detalles_compra.id;


--
-- Name: distribuciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.distribuciones (
    id integer NOT NULL,
    orden_compra_id integer,
    vehiculo_id integer,
    fecha_salida timestamp without time zone,
    fecha_entrega timestamp without time zone,
    estado character varying(30) DEFAULT 'pendiente'::character varying,
    coste_total_transporte numeric(14,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT distribuciones_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'en almacen'::character varying, 'en transito'::character varying, 'entregado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.distribuciones OWNER TO postgres;

--
-- Name: distribuciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.distribuciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.distribuciones_id_seq OWNER TO postgres;

--
-- Name: distribuciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.distribuciones_id_seq OWNED BY public.distribuciones.id;


--
-- Name: inventarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventarios (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    almacen_id integer NOT NULL,
    cantidad integer DEFAULT 0 NOT NULL,
    ubicacion_estanteria character varying(50),
    ultima_actualizacion timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventarios OWNER TO postgres;

--
-- Name: inventarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventarios_id_seq OWNER TO postgres;

--
-- Name: inventarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventarios_id_seq OWNED BY public.inventarios.id;


--
-- Name: ordenes_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordenes_compra (
    id integer NOT NULL,
    proveedor_id integer NOT NULL,
    fecha_emision date DEFAULT CURRENT_DATE NOT NULL,
    fecha_entrega_esperada date,
    fecha_entrega_real date,
    total numeric(14,2) DEFAULT 0,
    estado character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    usuario_registra_id integer,
    almacen_destino_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT ordenes_compra_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'en almacen'::character varying, 'en transito'::character varying, 'entregado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.ordenes_compra OWNER TO postgres;

--
-- Name: ordenes_compra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ordenes_compra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ordenes_compra_id_seq OWNER TO postgres;

--
-- Name: ordenes_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ordenes_compra_id_seq OWNED BY public.ordenes_compra.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    precio_unitario numeric(12,2) DEFAULT 0 NOT NULL,
    stock_actual integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0 NOT NULL,
    proveedor_id integer,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: proveedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedores (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    contacto character varying(150),
    telefono character varying(30),
    email character varying(150),
    direccion text,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.proveedores OWNER TO postgres;

--
-- Name: proveedores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedores_id_seq OWNER TO postgres;

--
-- Name: proveedores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proveedores_id_seq OWNED BY public.proveedores.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol_id integer NOT NULL,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id integer NOT NULL,
    placa character varying(20) NOT NULL,
    modelo character varying(100),
    capacidad_carga numeric(10,2),
    coste_por_km numeric(10,2) DEFAULT 0,
    estado character varying(30) DEFAULT 'disponible'::character varying,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT vehiculos_estado_check CHECK (((estado)::text = ANY ((ARRAY['disponible'::character varying, 'en ruta'::character varying, 'mantenimiento'::character varying, 'inactivo'::character varying])::text[])))
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- Name: vehiculos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculos_id_seq OWNER TO postgres;

--
-- Name: vehiculos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculos_id_seq OWNED BY public.vehiculos.id;


--
-- Name: alertas_sobrecostes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sobrecostes ALTER COLUMN id SET DEFAULT nextval('public.alertas_sobrecostes_id_seq'::regclass);


--
-- Name: almacenes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacenes ALTER COLUMN id SET DEFAULT nextval('public.almacenes_id_seq'::regclass);


--
-- Name: auditorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias ALTER COLUMN id SET DEFAULT nextval('public.auditorias_id_seq'::regclass);


--
-- Name: configuracion_alertas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_alertas ALTER COLUMN id SET DEFAULT nextval('public.configuracion_alertas_id_seq'::regclass);


--
-- Name: costes_almacenamiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_almacenamiento ALTER COLUMN id SET DEFAULT nextval('public.costes_almacenamiento_id_seq'::regclass);


--
-- Name: costes_logisticos_totales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_logisticos_totales ALTER COLUMN id SET DEFAULT nextval('public.costes_logisticos_totales_id_seq'::regclass);


--
-- Name: costes_transporte id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_transporte ALTER COLUMN id SET DEFAULT nextval('public.costes_transporte_id_seq'::regclass);


--
-- Name: detalles_compra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_compra ALTER COLUMN id SET DEFAULT nextval('public.detalles_compra_id_seq'::regclass);


--
-- Name: distribuciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribuciones ALTER COLUMN id SET DEFAULT nextval('public.distribuciones_id_seq'::regclass);


--
-- Name: inventarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios ALTER COLUMN id SET DEFAULT nextval('public.inventarios_id_seq'::regclass);


--
-- Name: ordenes_compra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_compra ALTER COLUMN id SET DEFAULT nextval('public.ordenes_compra_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: proveedores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedores ALTER COLUMN id SET DEFAULT nextval('public.proveedores_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: vehiculos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos ALTER COLUMN id SET DEFAULT nextval('public.vehiculos_id_seq'::regclass);


--
-- Data for Name: alertas_sobrecostes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alertas_sobrecostes (id, fecha, tipo, operacion_referencia, monto_esperado, monto_real, diferencia, porcentaje_exceso, estado, created_at) FROM stdin;
\.


--
-- Data for Name: almacenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.almacenes (id, nombre, ubicacion, capacidad_total, coste_mensual_operacion, activo, created_at, updated_at) FROM stdin;
1	Almacén Central Trujillo	Av. Industrial 1200, Trujillo	5000.00	8500.00	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
2	Almacén Norte La Esperanza	Carretera Industrial Km 5, La Esperanza	3000.00	5200.00	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
\.


--
-- Data for Name: auditorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditorias (id, usuario_id, accion, tabla_afectada, registro_id, fecha_cambio, datos_anteriores_json, datos_nuevos_json) FROM stdin;
\.


--
-- Data for Name: configuracion_alertas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_alertas (id, tipo, umbral_porcentaje, monto_presupuestado_mensual, updated_at) FROM stdin;
1	compra	10.00	50000.00	2026-06-13 16:31:12.46664
2	almacenamiento	10.00	15000.00	2026-06-13 16:31:12.46664
3	transporte	15.00	12000.00	2026-06-13 16:31:12.46664
4	distribucion	15.00	8000.00	2026-06-13 16:31:12.46664
5	general	10.00	85000.00	2026-06-13 16:31:12.46664
\.


--
-- Data for Name: costes_almacenamiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.costes_almacenamiento (id, almacen_id, fecha, concepto, monto, tipo_gasto, operacion_referencia, usuario_registra_id, created_at) FROM stdin;
\.


--
-- Data for Name: costes_logisticos_totales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.costes_logisticos_totales (id, operacion_referencia, tipo_operacion, fecha, monto_total, desglose_json, created_at) FROM stdin;
\.


--
-- Data for Name: costes_transporte; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.costes_transporte (id, vehiculo_id, fecha, ruta_origen, ruta_destino, kilometros_recorridos, coste_combustible, coste_peajes, coste_mantenimiento, coste_conductor, coste_total, operacion_referencia, usuario_registra_id, created_at) FROM stdin;
\.


--
-- Data for Name: detalles_compra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_compra (id, orden_compra_id, producto_id, cantidad, precio_unitario, subtotal) FROM stdin;
\.


--
-- Data for Name: distribuciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.distribuciones (id, orden_compra_id, vehiculo_id, fecha_salida, fecha_entrega, estado, coste_total_transporte, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventarios (id, producto_id, almacen_id, cantidad, ubicacion_estanteria, ultima_actualizacion) FROM stdin;
1	1	1	300	A-01-01	2026-06-13 16:31:12.46664
2	1	2	200	B-02-01	2026-06-13 16:31:12.46664
3	2	1	50	A-02-01	2026-06-13 16:31:12.46664
4	2	2	30	B-01-03	2026-06-13 16:31:12.46664
5	3	1	100	A-01-05	2026-06-13 16:31:12.46664
6	3	2	50	B-02-02	2026-06-13 16:31:12.46664
7	4	1	200	A-03-01	2026-06-13 16:31:12.46664
8	5	1	150	A-01-02	2026-06-13 16:31:12.46664
9	5	2	150	B-03-01	2026-06-13 16:31:12.46664
\.


--
-- Data for Name: ordenes_compra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordenes_compra (id, proveedor_id, fecha_emision, fecha_entrega_esperada, fecha_entrega_real, total, estado, usuario_registra_id, almacen_destino_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, nombre, descripcion, precio_unitario, stock_actual, stock_minimo, proveedor_id, activo, created_at, updated_at) FROM stdin;
1	Caja de cartón corrugado 40x30x30	Caja estándar para embalaje	3.50	500	100	1	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
2	Pallet de madera estándar	Pallet 1.2x1.0m capacidad 1000kg	45.00	80	20	2	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
3	Film stretch industrial	Rollo de film para paletizado, 500m	18.90	150	30	1	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
4	Etiquetas térmicas autoadhesivas	Rollo de 1000 etiquetas para impresora térmica	12.00	200	50	3	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
5	Cinta de embalaje reforzada	Cinta adhesiva 48mm x 100m	4.20	300	60	3	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
\.


--
-- Data for Name: proveedores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proveedores (id, nombre, contacto, telefono, email, direccion, activo, created_at, updated_at) FROM stdin;
1	Distribuidora del Norte S.A.	Carlos Méndez	044-123456	ventas@distnorte.com	Av. Industrial 450, Trujillo	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
2	Importadora Pacífico SAC	Lucía Ramos	044-654321	contacto@impacifico.com	Jr. Comercio 220, Trujillo	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
3	Suministros Andinos EIRL	Jorge Salazar	044-789012	info@suministrosandinos.com	Calle Los Pinos 88, La Esperanza	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre, descripcion) FROM stdin;
1	Administrador	Acceso total al sistema, gestión de usuarios y configuración
2	Operador Logistico	Registro de operaciones diarias: compras, costes, inventario, transporte
3	Supervisor	Supervisión de operaciones, validación de registros y alertas
4	Gerente	Acceso a dashboards ejecutivos, reportes y KPIs financieros
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash, rol_id, activo, created_at, updated_at) FROM stdin;
1	Administrador Sistema	admin@logistica.com	$2b$10$1BeJ2rN9Zc4DIpXnXpX0L.5e6j5I8Rc0k5VHiguQOo/ixi8eSPLhS	1	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:20.926023
2	Operador Logistico	operador@logistica.com	$2b$10$LanvZIvXd1iPlTgCI5Zzduc0yTnRcpP05o23c9So3PFtpUjFuw..O	2	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:21.175192
3	Supervisor General	supervisor@logistica.com	$2b$10$7ZSOLNHs.bJGDyTDFTZkKOFkPIKfcyPuM..4qw8k3Ssa3RK9cfQ1a	3	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:21.453371
4	Gerente General	gerente@logistica.com	$2b$10$07KPcv/7OO.kyvsOSEVt9eMFe4UKVxMAsYfwxbdFTi0va3P3FDKsO	4	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:22.01835
\.


--
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (id, placa, modelo, capacidad_carga, coste_por_km, estado, activo, created_at, updated_at) FROM stdin;
1	T1A-123	Volvo FH 16 - Camión de carga	12000.00	2.85	disponible	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
2	T2B-456	Hino 500 - Camión mediano	6000.00	1.95	disponible	t	2026-06-13 16:31:12.46664	2026-06-13 16:31:12.46664
\.


--
-- Name: alertas_sobrecostes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alertas_sobrecostes_id_seq', 1, false);


--
-- Name: almacenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.almacenes_id_seq', 2, true);


--
-- Name: auditorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditorias_id_seq', 1, false);


--
-- Name: configuracion_alertas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_alertas_id_seq', 5, true);


--
-- Name: costes_almacenamiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.costes_almacenamiento_id_seq', 1, false);


--
-- Name: costes_logisticos_totales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.costes_logisticos_totales_id_seq', 1, false);


--
-- Name: costes_transporte_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.costes_transporte_id_seq', 1, false);


--
-- Name: detalles_compra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_compra_id_seq', 1, false);


--
-- Name: distribuciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.distribuciones_id_seq', 1, false);


--
-- Name: inventarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventarios_id_seq', 9, true);


--
-- Name: ordenes_compra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ordenes_compra_id_seq', 1, false);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 5, true);


--
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedores_id_seq', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: vehiculos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehiculos_id_seq', 2, true);


--
-- Name: alertas_sobrecostes alertas_sobrecostes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas_sobrecostes
    ADD CONSTRAINT alertas_sobrecostes_pkey PRIMARY KEY (id);


--
-- Name: almacenes almacenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacenes
    ADD CONSTRAINT almacenes_pkey PRIMARY KEY (id);


--
-- Name: auditorias auditorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_pkey PRIMARY KEY (id);


--
-- Name: configuracion_alertas configuracion_alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_alertas
    ADD CONSTRAINT configuracion_alertas_pkey PRIMARY KEY (id);


--
-- Name: configuracion_alertas configuracion_alertas_tipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_alertas
    ADD CONSTRAINT configuracion_alertas_tipo_key UNIQUE (tipo);


--
-- Name: costes_almacenamiento costes_almacenamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_almacenamiento
    ADD CONSTRAINT costes_almacenamiento_pkey PRIMARY KEY (id);


--
-- Name: costes_logisticos_totales costes_logisticos_totales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_logisticos_totales
    ADD CONSTRAINT costes_logisticos_totales_pkey PRIMARY KEY (id);


--
-- Name: costes_transporte costes_transporte_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_transporte
    ADD CONSTRAINT costes_transporte_pkey PRIMARY KEY (id);


--
-- Name: detalles_compra detalles_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_compra
    ADD CONSTRAINT detalles_compra_pkey PRIMARY KEY (id);


--
-- Name: distribuciones distribuciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribuciones
    ADD CONSTRAINT distribuciones_pkey PRIMARY KEY (id);


--
-- Name: inventarios inventarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_pkey PRIMARY KEY (id);


--
-- Name: inventarios inventarios_producto_id_almacen_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_producto_id_almacen_id_key UNIQUE (producto_id, almacen_id);


--
-- Name: ordenes_compra ordenes_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_compra
    ADD CONSTRAINT ordenes_compra_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: proveedores proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehiculos_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_placa_key UNIQUE (placa);


--
-- Name: idx_alertas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alertas_estado ON public.alertas_sobrecostes USING btree (estado);


--
-- Name: idx_auditorias_tabla; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditorias_tabla ON public.auditorias USING btree (tabla_afectada, registro_id);


--
-- Name: idx_costes_almacen_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_costes_almacen_fecha ON public.costes_almacenamiento USING btree (almacen_id, fecha);


--
-- Name: idx_costes_totales_ref; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_costes_totales_ref ON public.costes_logisticos_totales USING btree (operacion_referencia);


--
-- Name: idx_costes_transporte_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_costes_transporte_fecha ON public.costes_transporte USING btree (vehiculo_id, fecha);


--
-- Name: idx_detalles_orden; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detalles_orden ON public.detalles_compra USING btree (orden_compra_id);


--
-- Name: idx_inventarios_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventarios_almacen ON public.inventarios USING btree (almacen_id);


--
-- Name: idx_inventarios_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventarios_producto ON public.inventarios USING btree (producto_id);


--
-- Name: idx_ordenes_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ordenes_estado ON public.ordenes_compra USING btree (estado);


--
-- Name: idx_ordenes_proveedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ordenes_proveedor ON public.ordenes_compra USING btree (proveedor_id);


--
-- Name: idx_productos_proveedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_productos_proveedor ON public.productos USING btree (proveedor_id);


--
-- Name: almacenes set_updated_at_almacenes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_almacenes BEFORE UPDATE ON public.almacenes FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: distribuciones set_updated_at_distribuciones; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_distribuciones BEFORE UPDATE ON public.distribuciones FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: ordenes_compra set_updated_at_ordenes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_ordenes BEFORE UPDATE ON public.ordenes_compra FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: productos set_updated_at_productos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_productos BEFORE UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: proveedores set_updated_at_proveedores; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_proveedores BEFORE UPDATE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: usuarios set_updated_at_usuarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: vehiculos set_updated_at_vehiculos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_vehiculos BEFORE UPDATE ON public.vehiculos FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: auditorias auditorias_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditorias
    ADD CONSTRAINT auditorias_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: costes_almacenamiento costes_almacenamiento_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_almacenamiento
    ADD CONSTRAINT costes_almacenamiento_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id);


--
-- Name: costes_almacenamiento costes_almacenamiento_usuario_registra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_almacenamiento
    ADD CONSTRAINT costes_almacenamiento_usuario_registra_id_fkey FOREIGN KEY (usuario_registra_id) REFERENCES public.usuarios(id);


--
-- Name: costes_transporte costes_transporte_usuario_registra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_transporte
    ADD CONSTRAINT costes_transporte_usuario_registra_id_fkey FOREIGN KEY (usuario_registra_id) REFERENCES public.usuarios(id);


--
-- Name: costes_transporte costes_transporte_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.costes_transporte
    ADD CONSTRAINT costes_transporte_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id);


--
-- Name: detalles_compra detalles_compra_orden_compra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_compra
    ADD CONSTRAINT detalles_compra_orden_compra_id_fkey FOREIGN KEY (orden_compra_id) REFERENCES public.ordenes_compra(id) ON DELETE CASCADE;


--
-- Name: detalles_compra detalles_compra_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_compra
    ADD CONSTRAINT detalles_compra_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: distribuciones distribuciones_orden_compra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribuciones
    ADD CONSTRAINT distribuciones_orden_compra_id_fkey FOREIGN KEY (orden_compra_id) REFERENCES public.ordenes_compra(id);


--
-- Name: distribuciones distribuciones_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribuciones
    ADD CONSTRAINT distribuciones_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id);


--
-- Name: inventarios inventarios_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id);


--
-- Name: inventarios inventarios_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventarios
    ADD CONSTRAINT inventarios_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id);


--
-- Name: ordenes_compra ordenes_compra_almacen_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_compra
    ADD CONSTRAINT ordenes_compra_almacen_destino_id_fkey FOREIGN KEY (almacen_destino_id) REFERENCES public.almacenes(id);


--
-- Name: ordenes_compra ordenes_compra_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_compra
    ADD CONSTRAINT ordenes_compra_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id);


--
-- Name: ordenes_compra ordenes_compra_usuario_registra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_compra
    ADD CONSTRAINT ordenes_compra_usuario_registra_id_fkey FOREIGN KEY (usuario_registra_id) REFERENCES public.usuarios(id);


--
-- Name: productos productos_proveedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id);


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict jry3aLQfRg4OCWA5aSfc1JrpiCTSpzTY5LZUqrvmoDvXc4WERax45K8wBSB3Fwi

