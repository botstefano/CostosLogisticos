# MEMORIA DESCRIPTIVA
## Sistema de Gestión y Control de Costes Logísticos

---

## 1.1 Introducción

El Sistema de Gestión y Control de Costes Logísticos es una aplicación web full-stack diseñada para automatizar y optimizar los procesos de gestión logística en el sector de supermercados, específicamente para **Plaza Vea**, una de las cadenas de supermercados más importantes del Perú. Este sistema surge como respuesta a la necesidad creciente de las empresas de retail por controlar de manera eficiente los costes asociados a las operaciones logísticas, desde la adquisición de productos de consumo hasta la distribución final a tiendas.

En el contexto actual de globalización y competitividad en el sector de supermercados, las organizaciones enfrentan presiones constantes para reducir costes operativos sin comprometer la calidad del servicio y la disponibilidad de productos. La gestión manual de procesos logísticos en grandes cadenas de supermercados resulta ineficiente, propensa a errores y dificulta la toma de decisiones basada en datos reales. Este sistema proporciona una solución integral que permite a Plaza Vea monitorear, analizar y controlar todos los aspectos de sus operaciones logísticas en tiempo real.

La importancia de este sistema radica en su capacidad para transformar datos operativos en información estratégica, permitiendo a los gerentes y supervisores identificar áreas de mejora, optimizar rutas de distribución entre centros de distribución y tiendas, gestionar inventarios de productos perecederos y no perecederos de manera eficiente, y mantener un control riguroso sobre los costes logísticos totales de la cadena de suministro.

---

## 1.2 Planteamiento del Problema

### Situación Problemática Anterior

Antes del desarrollo de este sistema, Plaza Vea y otras cadenas de supermercados enfrentaban múltiples deficiencias en sus procesos logísticos:

1. **Gestión Manual de Información**: Los procesos de registro de proveedores de productos de consumo, inventarios de supermercado, órdenes de compra y costes se realizaban de manera manual mediante hojas de cálculo o sistemas desconectados, lo que generaba duplicidad de información y falta de consistencia entre centros de distribución.

2. **Falta de Visibilidad en Tiempo Real**: Los gerentes de Plaza Vea no disponían de información actualizada sobre el estado de las órdenes de compra de productos de consumo, niveles de inventario en centros de distribución o costes de transporte, lo que dificultaba la toma de decisiones oportuna sobre reposición de productos.

3. **Control Ineficiente de Costes**: No existía un sistema centralizado para registrar y analizar los costes de almacenamiento de productos perecederos y no perecederos, así como los costes de transporte entre centros de distribución, lo que resultaba en sobrecostes no identificados y presupuestos excedidos.

4. **Procesos de Auditoría Complejos**: La trazabilidad de las operaciones logísticas entre centros de distribución era limitada, dificultando la identificación de responsables en caso de errores o irregularidades en la cadena de suministro.

5. **Generación Manual de Reportes**: La elaboración de reportes financieros y operativos de la cadena de supermercados requería considerable tiempo y esfuerzo, con alta probabilidad de errores humanos.

### Impacto en la Eficiencia y Productividad

Estas deficiencias afectaban significativamente la eficiencia operativa de Plaza Vea:
- **Tiempos de Procesamiento**: El registro manual de información duplicaba el tiempo necesario para completar operaciones básicas de reposición de productos.
- **Errores Humanos**: La falta de validación automática generaba errores en registros de costes, inventarios de productos perecederos y órdenes de compra.
- **Toma de Decisiones Retrasada**: La ausencia de información en tiempo real retrasaba decisiones críticas sobre rutas de distribución, proveedores de productos de consumo y asignación de recursos.
- **Pérdida de Oportunidades**: La incapacidad de identificar tendencias de costes impedía implementar mejoras continuas en la cadena de suministro del supermercado.

---

## 1.3 Objetivos

### Objetivo General

Desarrollar e implementar un sistema informático integral que permita optimizar y automatizar los procesos de gestión y control de costes logísticos de Plaza Vea, proporcionando herramientas para el monitoreo, análisis y toma de decisiones basada en datos en tiempo real para la cadena de suministro de supermercados.

### Objetivos Específicos

- **Analizar los requerimientos del usuario**: Identificar las necesidades específicas de diferentes roles (Administrador, Operador Logístico, Supervisor, Gerente) en el contexto de operaciones logísticas de supermercados como Plaza Vea.

- **Diseñar la arquitectura del sistema**: Establecer una arquitectura robusta y escalable que soporte las funcionalidades requeridas para la gestión de cadena de suministro de supermercados, separando claramente los componentes de backend, frontend y base de datos.

- **Implementar las funcionalidades requeridas**: Desarrollar módulos completos para gestión de proveedores de productos de consumo, inventarios de supermercado, órdenes de compra, costes de almacenamiento y transporte, distribución, alertas y auditoría.

- **Validar el correcto funcionamiento del software**: Realizar pruebas exhaustivas de todas las funcionalidades, incluyendo validación de datos, cálculos automáticos de costes logísticos y generación de reportes financieros.

- **Mejorar la gestión de la información y la toma de decisiones**: Proporcionar dashboards ejecutivos con KPIs relevantes para supermercados, alertas automáticas de sobrecostes y herramientas de análisis de tendencias en la cadena de suministro.

---

## 1.4 Justificación

### Razones Técnicas

El desarrollo de este sistema se justifica técnicamente por la necesidad de:
- **Centralización de Datos**: Unificar toda la información logística de Plaza Vea en una base de datos relacional robusta (PostgreSQL) que garantice integridad y consistencia entre centros de distribución.
- **Automatización de Cálculos**: Implementar algoritmos automáticos para el cálculo de costes logísticos totales de la cadena de suministro, eliminando errores humanos en operaciones matemáticas complejas.
- **Integración de Componentes**: Desarrollar una arquitectura de microservicios que permita escalabilidad y mantenimiento independiente de componentes.
- **Seguridad de la Información**: Implementar autenticación JWT, encriptación de contraseñas (bcrypt) y control de acceso basado en roles.

### Razones Económicas

Desde el punto de vista económico, el sistema ofrece beneficios significativos para Plaza Vea:
- **Reducción de Costes Operativos**: La automatización de procesos logísticos reduce el tiempo dedicado a tareas manuales, disminuyendo costes de mano de obra en la cadena de suministro.
- **Identificación de Sobrecostes**: Las alertas automáticas permiten detectar desviaciones presupuestarias en tiempo real, evitando gastos innecesarios en transporte y almacenamiento.
- **Optimización de Rutas**: El análisis de costes de transporte facilita la identificación de rutas más eficientes entre centros de distribución, reduciendo costes de combustible y peajes.
- **Mejora en la Gestión de Inventario**: El control de stock mínimo y alertas de bajo stock evitan pérdidas por falta de productos perecederos o sobrestocking de productos no perecederos.

### Razones Operativas

Operacionalmente, el sistema proporciona para Plaza Vea:
- **Estandarización de Procesos**: Todos los usuarios siguen los mismos procedimientos, garantizando consistencia en la gestión logística entre los diferentes centros de distribución.
- **Trazabilidad Completa**: Cada operación queda registrada con fecha, usuario responsable y detalles, facilitando auditorías y análisis de problemas en la cadena de suministro.
- **Accesibilidad Remota**: Al ser una aplicación web, permite el acceso desde cualquier ubicación con conexión a internet, facilitando la gestión centralizada desde la sede principal.
- **Generación Automática de Reportes**: Los reportes PDF/Excel se generan automáticamente, reduciendo el tiempo dedicado a elaboración de informes financieros y operativos del supermercado.

### Razones Organizacionales

Desde la perspectiva organizacional:
- **Mejora en la Toma de Decisiones**: Los dashboards ejecutivos proporcionan información visual y actualizada para decisiones estratégicas sobre la cadena de suministro.
- **Capacitación Simplificada**: La interfaz intuitiva reduce el tiempo de capacitación de nuevos usuarios en los diferentes centros de distribución.
- **Escalabilidad**: La arquitectura del sistema permite agregar nuevos módulos y funcionalidades según las necesidades de expansión de Plaza Vea.
- **Cumplimiento de Normativas**: El sistema de auditoría y trazabilidad facilita el cumplimiento de normativas de control y calidad en el sector de supermercados.

---

## 1.5 Alcances y Limitaciones

### Alcances

El sistema cubre los siguientes procesos y funcionalidades:

#### Procesos Automatizados
- **Gestión de Proveedores de Productos de Consumo**: Registro, actualización y eliminación de información de proveedores como Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson.
- **Gestión de Productos de Supermercado**: Catálogo completo de productos de consumo (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante).
- **Órdenes de Compra de Productos de Consumo**: Creación, seguimiento y gestión de órdenes de compra con detalles de productos y estados.
- **Gestión de Inventario por Centro de Distribución**: Control de inventarios en los 5 centros de distribución (Trujillo, Chiclayo, Lima, Arequipa, Piura) con actualización automática al recibir mercancía.
- **Costes de Almacenamiento de Productos Perecederos y No Perecederos**: Registro de costes operativos (alquiler, mantenimiento de cámaras frigoríficas, servicios, mano de obra).
- **Costes de Transporte entre Centros de Distribución**: Gestión de costes de transporte por vehículo con desglose de combustible, peajes, mantenimiento y conductor.
- **Distribución Logística a Tiendas**: Asignación de vehículos de la flota Plaza Vea y rutas a órdenes de compra con seguimiento de estados.
- **Alertas de Sobrecostes en Cadena de Suministro**: Detección automática de desviaciones de costes respecto a umbrales configurables.
- **Auditoría de Cambios Logísticos**: Registro completo de todas las modificaciones realizadas en el sistema.
- **Generación de Reportes Financieros de Supermercado**: Exportación de datos en formato PDF y Excel para todas las entidades principales.

#### Funcionalidades Disponibles
- **Autenticación y Control de Acceso**: Sistema de login con JWT y gestión de roles (Administrador, Operador Logístico, Supervisor, Gerente) para la gestión de Plaza Vea.
- **Dashboard Ejecutivo de Supermercado**: Visualización de KPIs principales: coste total mensual de cadena de suministro, real vs presupuesto, top productos por coste, alertas activas.
- **Búsqueda y Filtrado**: Capacidades avanzadas de búsqueda y filtrado en todas las vistas de datos de centros de distribución.
- **Validación de Datos**: Validaciones automáticas en formularios para garantizar integridad de datos de productos de consumo.
- **Cálculos Automáticos**: Cálculo automático de subtotales, totales y costes logísticos totales de la cadena de suministro.

#### Generación de Reportes e Indicadores
- **Reportes de Compras de Productos de Consumo**: Resumen de órdenes de compra por proveedor (Nestlé, Gloria, Backus, etc.), fecha y estado.
- **Reportes de Inventario por Centro de Distribución**: Estado actual de inventarios en los 5 centros de distribución y producto.
- **Reportes de Costes Logísticos**: Análisis detallado de costes de almacenamiento y transporte entre centros de distribución.
- **Reportes Financieros de Supermercado**: Resumen ejecutivo de costes logísticos totales de la cadena de suministro.
- **Indicadores KPI de Retail**: Métricas clave de rendimiento en tiempo real para supermercados.

#### Gestión de Bases de Datos y Seguridad
- **Base de Datos Relacional**: PostgreSQL 16 con 15 tablas relacionadas para la gestión de Plaza Vea.
- **Seguridad de Contraseñas**: Encriptación bcrypt para todas las contraseñas de usuario.
- **Control de Acceso**: Middleware de autenticación y autorización basado en roles para centros de distribución.
- **Copias de Seguridad**: Sistema de backups automáticos cada 24 horas y backups manuales bajo demanda.
- **Integridad de Datos**: Restricciones de integridad referencial y validaciones a nivel de base de datos.

### Limitaciones

#### Restricciones Tecnológicas
- **Dependencia de Docker**: El sistema está diseñado para ejecutarse en contenedores Docker, lo que requiere que el entorno de producción de Plaza Vea tenga Docker y Docker Comporte instalados.
- **Compatibilidad de Navegadores**: Requiere navegadores modernos que soporten ES6+ (Chrome, Firefox, Edge, Safari versiones recientes).
- **Requisitos de Hardware**: Mínimo 4GB de RAM para ejecutar los tres contenedores (base de datos, backend, frontend) simultáneamente.

#### Dependencia de Conexión a Internet
- **Acceso Web**: Al ser una aplicación web, requiere conexión a internet para acceder a la interfaz (en caso de despliegue en la nube).
- **Dependencias de NPM**: El proceso de construcción requiere acceso a internet para descargar paquetes de npm.

#### Compatibilidad con Sistemas Operativos
- **Docker Multiplataforma**: El sistema es compatible con Windows, Linux y macOS siempre que Docker esté instalado y configurado correctamente.
- **Configuración de Locales**: En sistemas Windows, puede requerir configuración específica de locales para PostgreSQL (resuelto con variables de entorno LANG y LC_ALL).

#### Restricciones de Acceso Según Roles de Usuario
- **Administrador**: Acceso total a todas las funcionalidades del sistema de gestión de Plaza Vea.
- **Operador Logístico**: Acceso a CRUDs operativos (proveedores de productos de consumo, inventarios de supermercado, costes, distribución).
- **Supervisor**: Acceso de lectura, gestión de estados/alertas y auditoría de operaciones logísticas.
- **Gerente**: Acceso de lectura, dashboard, reportes financieros y configuración de alertas de la cadena de suministro.

---

## 1.6 Descripción del Sistema

### Estructura Funcional

El Sistema de Gestión y Control de Costes Logísticos de Plaza Vea está organizado en módulos funcionales que integran todos los aspectos de la gestión logística de supermercados:

#### Módulos del Sistema

##### 1. Gestión de Usuarios
- **Autenticación**: Sistema de login seguro con tokens JWT.
- **Gestión de Roles**: Cuatro roles predefinidos con permisos específicos.
- **Perfil de Usuario**: Información de contacto y asignación de rol.
- **Control de Sesiones**: Gestión de sesiones activas y cierre de sesión seguro.

##### 2. Registro de Información
- **Proveedores de Productos de Consumo**: Gestión completa del catálogo de proveedores como Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson con información de contacto, teléfono, email y dirección.
- **Productos de Supermercado**: Catálogo de productos de consumo (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante) con descripciones, precios unitarios, stock actual y stock mínimo.
- **Centros de Distribución**: Registro de los 5 centros de distribución de Plaza Vea (Trujillo, Chiclayo, Lima, Arequipa, Piura) con ubicación, capacidad total y coste mensual de operación.
- **Vehículos de la Flota Plaza Vea**: Gestión de la flota de camiones refrigerados y de distribución con placa, modelo, capacidad de carga y coste por km.

##### 3. Procesamiento de Datos
- **Órdenes de Compra de Productos de Consumo**: Sistema completo de gestión de órdenes de compra con detalles de productos de supermercado y seguimiento de estados.
- **Inventario por Centro de Distribución**: Actualización automática de inventarios en los 5 centros de distribución al recibir mercancía y ajustes manuales.
- **Costes de Almacenamiento de Productos Perecederos y No Perecederos**: Registro y categorización de costes operativos por tipo (alquiler, mantenimiento de cámaras frigoríficas, mano de obra, servicios, otros).
- **Costes de Transporte entre Centros de Distribución**: Gestión detallada de costes de transporte con desglose por componente (combustible, peajes, mantenimiento, conductor).

##### 4. Reportes e Indicadores
- **Dashboard Ejecutivo de Supermercado**: Visualización de KPIs principales de la cadena de suministro con gráficos interactivos.
- **Reportes PDF**: Generación de reportes en formato PDF para todas las entidades principales de Plaza Vea.
- **Reportes Excel**: Exportación de datos a Excel para análisis externo de costes logísticos.
- **Indicadores de Costes Logísticos**: Cálculo automático de costes logísticos totales y comparación con presupuestos de supermercado.

##### 5. Administración y Configuración
- **Configuración de Alertas**: Definición de umbrales de alertas por tipo de operación (compra, almacenamiento, transporte, distribución, general).
- **Gestión de Backups**: Sistema de copias de seguridad automáticas y manuales.
- **Auditoría**: Registro completo de todos los cambios realizados en el sistema.
- **Configuración del Sistema**: Parámetros generales como umbral de alerta predeterminado.

### Procesos Principales

#### Flujo de Órdenes de Compra
1. **Creación**: El operador logístico de Plaza Vea crea una orden de compra seleccionando proveedor (Nestlé, Gloria, Backus, etc.), productos de consumo y cantidades.
2. **Validación**: El sistema valida automáticamente la disponibilidad de stock en centros de distribución y calcula subtotales.
3. **Aprobación**: (Opcional) El supervisor aprueba la orden si excede ciertos montos.
4. **Asignación de Vehículo**: Se asigna un vehículo de la flota Plaza Vea para el transporte de la mercancía entre centros de distribución.
5. **Seguimiento**: La orden pasa por estados: pendiente → en almacén → en tránsito → entregado.
6. **Actualización de Inventario**: Al recibir la mercancía en el centro de distribución, el inventario se actualiza automáticamente.
7. **Registro de Costes**: Se registran los costes de transporte y almacenamiento asociados.

#### Flujo de Alertas de Sobrecostes
1. **Configuración**: El administrador de Plaza Vea define umbrales de alerta por tipo de operación en la cadena de suministro.
2. **Registro de Costes**: Al registrar un coste logístico, el sistema compara con el umbral configurado.
3. **Detección**: Si el coste excede el umbral, se genera automáticamente una alerta de sobrecoste.
4. **Notificación**: La alerta se muestra en el dashboard ejecutivo y en el módulo de alertas.
5. **Revisión**: El supervisor revisa la alerta y determina si es válida.
6. **Resolución**: La alerta se marca como resuelta o descartada según el análisis.

### Usuarios Involucionados

#### Administrador
- Responsable de la configuración general del sistema de gestión de Plaza Vea.
- Gestiona usuarios y asigna roles para los diferentes centros de distribución.
- Configura umbrales de alertas de sobrecostes en la cadena de suministro.
- Realiza copias de seguridad de la base de datos.
- Tiene acceso a todas las funcionalidades del sistema logístico.

#### Operador Logístico
- Realiza operaciones CRUD en proveedores de productos de consumo, inventarios de supermercado y centros de distribución.
- Crea y gestiona órdenes de compra de productos de consumo.
- Registra costes de almacenamiento de productos perecederos y no perecederos.
- Registra costes de transporte entre centros de distribución.
- Asigna vehículos de la flota Plaza Vea a distribuciones.
- Actualiza estados de pedidos de productos.

#### Supervisor
- Monitorea el dashboard ejecutivo de la cadena de suministro.
- Revisa y gestiona alertas de sobrecostes logísticos.
- Aprueba órdenes de compra de productos de consumo que exceden ciertos montos.
- Realiza auditorías de cambios en operaciones logísticas.
- Genera reportes de análisis de costes de supermercado.

#### Gerente
- Accede al dashboard ejecutivo de Plaza Vea.
- Genera reportes financieros y operativos de supermercado.
- Configura umbrales de alertas de costes logísticos.
- Analiza tendencias de costes en la cadena de suministro.
- Toma decisiones estratégicas basadas en datos de centros de distribución.

### Funcionalidades Implementadas

#### RF01 - RF18 (Requerimientos Funcionales)
1. **Autenticación y roles**: Sistema completo de autenticación JWT con control de acceso basado en roles para Plaza Vea.
2. **Proveedores de productos de consumo**: CRUD completo de proveedores (Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson) con validaciones.
3. **Productos de supermercado**: Gestión de productos de consumo (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante) con alerta de bajo stock.
4. **Órdenes de compra de productos de consumo**: Registro y seguimiento con validación automática.
5. **Inventario por centro de distribución**: Actualización automática y ajustes manuales en los 5 centros de distribución.
6. **Costes de almacenamiento de productos perecederos y no perecederos**: Registro por tipo de gasto.
7. **Costes de transporte entre centros de distribución**: Gestión detallada con cálculo de coste/km para la flota Plaza Vea.
8. **Cálculo automático de costes logísticos totales**: Ejecutado automáticamente al registrar operaciones de supermercado.
9. **Reportes PDF/Excel**: Generación para todas las tablas principales de Plaza Vea.
10. **Dashboard ejecutivo de supermercado**: KPIs en tiempo real con gráficos de la cadena de suministro.
11. **Trazabilidad completa**: Línea de tiempo de pedidos de productos de consumo con estados y costes.
12. **Alertas automáticas de sobrecostes logísticos**: Con umbrales configurables.
13. **Gestión de vehículos de la flota Plaza Vea**: Estados y mantenimiento.
14. **Registro de gastos operativos**: Vía costes de almacenamiento de productos perecederos y no perecederos.
15. **Distribución logística a tiendas**: Asignación de rutas y vehículos entre centros de distribución.
16. **Estados de pedido**: Flujo completo de estados para productos de consumo.
17. **Auditoría de cambios**: Registro de quién, qué y cuándo.
18. **Copias de seguridad**: Manual y automática cada 24h.

#### RNF01 - RNF10 (Requerimientos No Funcionales)
1. **Seguridad**: Autenticación JWT, encriptación bcrypt, control de acceso para centros de distribución de Plaza Vea.
2. **Rendimiento**: Tiempos de respuesta < 2 segundos para operaciones CRUD de productos de consumo.
3. **Escalabilidad**: Arquitectura de microservicios con Docker para expansión de centros de distribución.
4. **Disponibilidad**: Sistema disponible 24/7 con reinicio automático.
5. **Usabilidad**: Interfaz intuitiva con Tailwind CSS para gestión de supermercado.
6. **Mantenibilidad**: Código modular y documentado para la cadena de suministro.
7. **Portabilidad**: Ejecutable en Windows, Linux, macOS con Docker para centros de distribución de Plaza Vea.
8. **Integridad de Datos**: Restricciones de integridad referencial en PostgreSQL para productos de consumo.
9. **Auditoría**: Registro completo de cambios en operaciones logísticas.
10. **Backups**: Sistema de copias de seguridad automático y manual.

### Arquitectura del Sistema

#### Arquitectura de Tres Capas
- **Capa de Presentación**: Frontend React con Vite, Tailwind CSS y React Router.
- **Capa de Lógica de Negocio**: Backend Node.js con Express, middleware de autenticación y validación.
- **Capa de Datos**: PostgreSQL 16 con schema relacional de 15 tablas.

#### Modelo de Base de Datos
El sistema utiliza una base de datos relacional PostgreSQL con las siguientes tablas principales para la gestión de Plaza Vea:
- `roles`: Definición de roles de usuario.
- `usuarios`: Información de usuarios y credenciales.
- `proveedores`: Catálogo de proveedores de productos de consumo (Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson).
- `productos`: Catálogo de productos de supermercado (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante).
- `almacenes`: Centros de distribución de Plaza Vea (Trujillo, Chiclayo, Lima, Arequipa, Piura).
- `inventarios`: Stock por producto y centro de distribución.
- `ordenes_compra`: Órdenes de compra de productos de consumo.
- `detalles_compra`: Detalles de productos en órdenes.
- `costes_almacenamiento`: Costes operativos de centros de distribución (productos perecederos y no perecederos).
- `vehiculos`: Flota de camiones Plaza Vea.
- `costes_transporte`: Costes de transporte por vehículo entre centros de distribución.
- `distribuciones`: Asignación de vehículos a órdenes.
- `costes_logisticos_totales`: Resumen de costes totales de la cadena de suministro.
- `alertas_sobrecostes`: Alertas de desviaciones de costes logísticos.
- `auditorias`: Registro de cambios en operaciones.
- `configuracion_alertas`: Umbrales de alertas por tipo.

---

## 1.7 Tecnologías Utilizadas

### Componente Tecnológico

| Componente | Tecnología | Versión | Descripción |
|-------------|-----------|---------|-------------|
| **Lenguaje de Programación** | JavaScript (Node.js) | 20-alpine | Entorno de ejecución para backend |
| **Framework Backend** | Express.js | 4.x | Framework web para API REST |
| **Base de Datos** | PostgreSQL | 16-alpine | Sistema de gestión de bases de datos relacional |
| **Frontend** | React | 18.x | Biblioteca JavaScript para interfaces de usuario |
| **Build Tool Frontend** | Vite | 5.x | Herramienta de construcción y desarrollo rápido |
| **Estilos** | Tailwind CSS | 3.x | Framework CSS utilitario para diseño rápido |
| **Enrutamiento** | React Router | 6.x | Enrutamiento declarativo para React |
| **Gráficos** | Recharts | 2.x | Biblioteca de gráficos para React |
| **HTTP Client** | Axios | 1.x | Cliente HTTP para peticiones API |
| **Generación PDF** | PDFKit | 0.13.x | Generación de documentos PDF |
| **Generación Excel** | ExcelJS | 4.x | Generación de hojas de cálculo Excel |
| **Autenticación** | JWT (jsonwebtoken) | 9.x | Tokens JSON Web para autenticación |
| **Encriptación** | bcrypt | 5.x | Encriptación de contraseñas |
| **Validación** | express-validator | 7.x | Validación de datos en Express |
| **Logging** | Morgan | 1.x | Middleware de logging HTTP |
| **Seguridad** | Helmet | 7.x | Middleware de seguridad HTTP |
| **CORS** | cors | 2.x | Middleware para habilitar CORS |
| **Variables de Entorno** | dotenv | 16.x | Carga de variables de entorno |
| **Contenedores** | Docker | Latest | Plataforma de contenedores |
| **Orquestación** | Docker Compose | Latest | Herramienta para definir y ejecutar aplicaciones Docker multi-contenedor |
| **Control de Versiones** | Git | Latest | Sistema de control de versiones distribuido |
| **IDE** | Visual Studio Code | Latest | Entorno de desarrollo integrado |

### Justificación de Selección Tecnológica

#### Backend (Node.js + Express)
- **Rendimiento**: Node.js ofrece excelente rendimiento para I/O asíncrono, ideal para aplicaciones web.
- **Ecosistema**: NPM proporciona acceso a miles de paquetes de calidad probada.
- **JavaScript**: Uso del mismo lenguaje en frontend y backend facilita el desarrollo.
- **Escalabilidad**: Arquitectura orientada a eventos permite manejar múltiples conexiones concurrentes.

#### Frontend (React + Vite + Tailwind CSS)
- **React**: Biblioteca de componentes con estado virtual DOM para renderizado eficiente.
- **Vite**: Herramienta de desarrollo ultrarrápida con hot module replacement.
- **Tailwind CSS**: Framework CSS utilitario que acelera el desarrollo de interfaces.
- **React Router**: Enrutamiento declarativo para SPA (Single Page Applications).

#### Base de Datos (PostgreSQL)
- **Robustez**: Sistema de bases de datos relacional con alto rendimiento y confiabilidad.
- **Características Avanzadas**: Soporte para transacciones ACID, índices, triggers y vistas.
- **Escalabilidad**: Capacidad para manejar grandes volúmenes de datos.
- **Open Source**: Sin costes de licenciamiento y comunidad activa.

#### Infraestructura (Docker + Docker Compose)
- **Portabilidad**: Contenedores consistentes en cualquier entorno de desarrollo o producción.
- **Aislamiento**: Cada servicio se ejecuta en su propio contenedor, evitando conflictos de dependencias.
- **Escalabilidad**: Fácil escalado horizontal de servicios.
- **Automatización**: Docker Compose facilita la orquestación de servicios multi-contenedor.

### Herramientas de Desarrollo

#### Control de Versiones
- **Git**: Sistema de control de versiones distribuido para seguimiento de cambios.
- **GitHub**: Plataforma para alojamiento de repositorios y colaboración.

#### Entorno de Desarrollo
- **Visual Studio Code**: Editor de código ligero con soporte para JavaScript/TypeScript.
- **Extensiones**: ESLint, Prettier, Docker extension para desarrollo eficiente.

#### Testing
- **Jest**: Framework de testing para JavaScript (futuro implementación).
- **Supertest**: Biblioteca para testing de endpoints HTTP (futuro implementación).

---

## Conclusión

El Sistema de Gestión y Control de Costes Logísticos representa una solución integral y moderna para la automatización de procesos logísticos. Su arquitectura robusta, tecnologías actualizadas y funcionalidades completas lo posicionan como una herramienta estratégica para organizaciones que buscan optimizar sus operaciones logísticas, reducir costes y mejorar la toma de decisiones basada en datos.

La implementación de este sistema no solo resuelve los problemas identificados en los procesos manuales existentes, sino que establece una base tecnológica sólida para futuras expansiones y mejoras continuas en la gestión logística.
