# MANUAL DE USUARIO
## Sistema de Gestión y Control de Costes Logísticos - Plaza Vea

---

## 2.1 Presentación

El Sistema de Gestión y Control de Costes Logísticos es una aplicación web integral diseñada para facilitar la administración eficiente de operaciones logísticas de **Plaza Vea**, una de las cadenas de supermercados más importantes del Perú. Este manual proporciona una guía completa para que los usuarios puedan aprovechar al máximo todas las funcionalidades del sistema.

### Propósito del Sistema

El sistema tiene como propósito principal:
- **Centralizar la información logística de Plaza Vea**: Unificar en una sola plataforma todos los datos relacionados con proveedores de productos de consumo, inventarios de supermercado, costes y distribuciones entre centros de distribución.
- **Automatizar procesos**: Reducir el tiempo dedicado a tareas manuales mediante cálculos automáticos y validaciones en la cadena de suministro.
- **Controlar costes de supermercado**: Monitorear y analizar los costes logísticos en tiempo real para identificar áreas de mejora en centros de distribución.
- **Facilitar la toma de decisiones**: Proporcionar dashboards ejecutivos y reportes para decisiones informadas sobre la gestión de productos de consumo.
- **Garantizar trazabilidad**: Registrar todas las operaciones de la cadena de suministro para auditoría y análisis de problemas.

### Usuarios del Sistema

El sistema está diseñado para cuatro tipos de usuarios con diferentes niveles de acceso:
- **Administrador**: Acceso total a todas las funcionalidades del sistema de gestión de Plaza Vea.
- **Operador Logístico**: Realiza operaciones CRUD y gestiona el día a día de operaciones logísticas en centros de distribución.
- **Supervisor**: Monitorea operaciones, revisa alertas y realiza auditorías de la cadena de suministro.
- **Gerente**: Accede a reportes ejecutivos y toma decisiones estratégicas sobre la gestión de supermercado.

---

## 2.2 Requisitos del Sistema

### Requisitos de Hardware

Para ejecutar el sistema de manera óptima para la gestión de Plaza Vea, se recomienda:
- **Procesador**: Mínimo 2 núcleos, recomendado 4 núcleos o más
- **Memoria RAM**: Mínimo 4GB, recomendado 8GB o más
- **Espacio en Disco**: Mínimo 10GB disponibles
- **Conexión a Internet**: Requerida para acceso a la aplicación web desde los centros de distribución (en caso de despliegue en la nube)

### Requisitos de Software

#### Sistema Operativo
- **Windows**: Windows 10 o superior
- **Linux**: Ubuntu 20.04 LTS o superior, Debian 11 o superior
- **macOS**: macOS 10.15 (Catalina) o superior

#### Navegador Web Recomendado
- **Google Chrome**: Versión 90 o superior (recomendado)
- **Mozilla Firefox**: Versión 88 o superior
- **Microsoft Edge**: Versión 90 o superior
- **Safari**: Versión 14 o superior (macOS/iOS)

**Nota**: El sistema requiere navegadores modernos que soporten JavaScript ES6+ y CSS3.

#### Docker (para despliegue local)
- **Docker Desktop**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior

### Requisitos de Red

- **Ancho de banda**: Mínimo 1 Mbps para operación básica
- **Latencia**: Preferiblemente menor a 100ms para mejor experiencia de usuario
- **Firewall**: Puertos 4000 (backend), 5173 (frontend) y 5432 (base de datos) deben estar abiertos

---

## 2.3 Acceso al Sistema

### Ingreso mediante Usuario y Contraseña

#### Paso 1: Acceder a la URL del Sistema
Abra su navegador web y navegue a la URL proporcionada por el administrador de Plaza Vea:
- **Entorno de Desarrollo**: http://localhost:5173
- **Entorno de Producción**: URL proporcionada por el equipo de TI de Plaza Vea

#### Paso 2: Pantalla de Login
Se mostrará la pantalla de inicio de sesión con los siguientes campos:
- **Email**: Ingrese su dirección de correo electrónico registrada en el sistema de Plaza Vea
- **Contraseña**: Ingrese su contraseña (los caracteres aparecerán como puntos por seguridad)

#### Paso 3: Iniciar Sesión
Haga clic en el botón "Iniciar Sesión". Si las credenciales son correctas, será redirigido al dashboard principal del sistema de gestión logística de Plaza Vea.

#### Usuarios Demo Precargados
Para propósitos de prueba y demostración del sistema de Plaza Vea, el sistema incluye los siguientes usuarios:

| Email | Password | Rol |
|---|---|---|
| admin@logistica.com | admin123 | Administrador |
| operador@logistica.com | oper123 | Operador Logístico |
| supervisor@logistica.com | sup123 | Supervisor |
| gerente@logistica.com | ger123 | Gerente |

### Recuperación de Contraseña

**Nota**: En la versión actual del sistema de Plaza Vea, la recuperación de contraseña debe ser realizada por el Administrador. Para solicitar un restablecimiento de contraseña:

1. Contacte al Administrador del sistema de gestión logística de Plaza Vea
2. Proporcione su email y justificación del cambio
3. El Administrador generará una nueva contraseña temporal
4. Al iniciar sesión con la contraseña temporal, se recomienda cambiarla inmediatamente

### Cierre de Sesión

Para cerrar sesión de manera segura del sistema de Plaza Vea:

1. Haga clic en el icono de perfil en la esquina superior derecha de la pantalla
2. Seleccione la opción "Cerrar Sesión"
3. Será redirigido a la pantalla de login

**Recomendación de Seguridad**: Siempre cierre sesión al terminar su trabajo en los centros de distribución de Plaza Vea, especialmente si está utilizando una computadora compartida o pública.

---

## 2.4 Menú Principal

El menú principal del sistema se encuentra en la barra lateral izquierda y proporciona acceso a todas las funcionalidades según el rol del usuario.

### Estructura del Menú

#### Dashboard
- **Descripción**: Vista principal con KPIs ejecutivos y gráficos en tiempo real de la cadena de suministro de Plaza Vea.
- **Acceso**: Todos los roles
- **Contenido**: Costes totales de centros de distribución, alertas activas, top productos por coste, tendencias de costes logísticos.

#### Compras
- **Descripción**: Gestión de proveedores de productos de consumo y órdenes de compra.
- **Acceso**: Administrador, Operador Logístico
- **Submenús**:
  - Proveedores: CRUD de proveedores (Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson)
  - Órdenes de Compra: Gestión de pedidos de productos de supermercado

#### Inventario
- **Descripción**: Gestión de productos de supermercado e inventarios por centro de distribución.
- **Acceso**: Administrador, Operador Logístico
- **Submenús**:
  - Productos: Catálogo de productos de consumo (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante)
  - Inventario: Stock por centro de distribución (Trujillo, Chiclayo, Lima, Arequipa, Piura)

#### Costes
- **Descripción**: Registro y análisis de costes logísticos de Plaza Vea.
- **Acceso**: Administrador, Operador Logístico
- **Submenús**:
  - Almacenamiento: Costes operativos de centros de distribución (productos perecederos y no perecederos)
  - Transporte: Costes de transporte entre centros de distribución

#### Distribución
- **Descripción**: Gestión de distribución logística y vehículos de la flota Plaza Vea.
- **Acceso**: Administrador, Operador Logístico
- **Submenús**:
  - Distribuciones: Asignación de rutas y vehículos entre centros de distribución
  - Vehículos: Gestión de la flota de camiones refrigerados y de distribución

#### Alertas
- **Descripción**: Monitoreo y gestión de alertas de sobrecostes logísticos.
- **Acceso**: Administrador, Supervisor, Gerente
- **Contenido**: Alertas activas, revisión y resolución de alertas de la cadena de suministro.

#### Auditoría
- **Descripción**: Registro de cambios y trazabilidad de operaciones logísticas.
- **Acceso**: Administrador, Supervisor
- **Contenido**: Historial de modificaciones por usuario y fecha en centros de distribución.

#### Reportes
- **Descripción**: Generación de reportes PDF y Excel de Plaza Vea.
- **Acceso**: Todos los roles
- **Submenús**:
  - Reportes PDF: Generación de documentos PDF para todas las entidades principales de Plaza Vea
  - Reportes Excel: Exportación a hojas de cálculo para análisis externo de costes logísticos

#### Usuarios (Solo Administrador)
- **Descripción**: Gestión de usuarios y roles del sistema de gestión de Plaza Vea.
- **Acceso**: Solo Administrador
- **Contenido**: Creación, edición y eliminación de usuarios para centros de distribución.

#### Backups (Solo Administrador)
- **Descripción**: Gestión de copias de seguridad del sistema de Plaza Vea.
- **Acceso**: Solo Administrador
- **Contenido**: Backups manuales y automáticos de la base de datos de la cadena de suministro.

### Navegación

- **Clic en menú**: Haga clic en cualquier opción del menú para navegar a la sección correspondiente del sistema de Plaza Vea.
- **Breadcrumbs**: En la parte superior de cada página se muestra la ruta de navegación.
- **Búsqueda**: Utilice la barra de búsqueda en la parte superior para buscar rápidamente información de productos de consumo o centros de distribución.

---

## 2.5 Procedimientos Operativos

### Registrar Información

#### Registrar un Nuevo Proveedor

1. Navegue a **Compras > Proveedores**
2. Haga clic en el botón "Nuevo Proveedor"
3. Complete el formulario con la siguiente información:
   - **Nombre**: Nombre completo de la empresa proveedora de productos de consumo (ej: Nestlé Perú S.A., Gloria S.A., Backus y Johnston S.A.A.)
   - **Contacto**: Nombre de la persona de contacto
   - **Teléfono**: Número de teléfono de contacto
   - **Email**: Dirección de correo electrónico
   - **Dirección**: Dirección física del proveedor
4. Haga clic en "Guardar"
5. El sistema validará la información y mostrará un mensaje de confirmación

#### Registrar un Nuevo Producto de Supermercado

1. Navegue a **Inventario > Productos**
2. Haga clic en el botón "Nuevo Producto"
3. Complete el formulario:
   - **Nombre**: Nombre del producto de consumo (ej: Arroz Costeño Premium 1kg, Leche Gloria Entera 1L)
   - **Descripción**: Descripción detallada del producto
   - **Precio Unitario**: Precio por unidad (formato numérico)
   - **Stock Actual**: Cantidad disponible en inventario
   - **Stock Mínimo**: Cantidad mínima para alerta de bajo stock
   - **Proveedor**: Seleccione el proveedor del menú desplegable (Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson)
4. Haga clic en "Guardar"

#### Crear una Orden de Compra de Productos de Consumo

1. Navegue a **Compras > Órdenes de Compra**
2. Haga clic en "Nueva Orden de Compra"
3. Complete la información general:
   - **Proveedor**: Seleccione el proveedor de productos de consumo (Nestlé, Gloria, Backus, P&G, Unilever, Alicorp, Pepsico, Johnson & Johnson)
   - **Fecha de Emisión**: Fecha de creación de la orden (por defecto: hoy)
   - **Fecha de Entrega Esperada**: Fecha estimada de entrega al centro de distribución
   - **Almacén de Destino**: Seleccione el centro de distribución (Trujillo, Chiclayo, Lima, Arequipa, Piura)
4. Agregue productos a la orden:
   - Seleccione el producto de consumo del menú (arroz, fideos, leche, cerveza, gaseosa, detergente, jabón, aceite, azúcar, café, atún, galletas, shampoo, pasta dental, desodorante)
   - Ingrese la cantidad deseada
   - El sistema calculará automáticamente el subtotal
   - Haga clic en "Agregar Producto"
5. Repita el paso 4 para todos los productos necesarios
6. Haga clic en "Crear Orden"
7. La orden se creará con estado "Pendiente"

### Editar Registros

#### Editar un Proveedor

1. Navegue a **Compras > Proveedores**
2. Busque el proveedor que desea editar utilizando la barra de búsqueda o navegando por la tabla
3. Haga clic en el botón "Editar" (icono de lápiz) en la fila del proveedor
4. Modifique los campos necesarios
5. Haga clic en "Guardar Cambios"
6. El sistema actualizará el registro y mostrará confirmación

#### Editar un Producto

1. Navegue a **Inventario > Productos**
2. Busque el producto que desea editar
3. Haga clic en "Editar"
4. Modifique la información necesaria
5. Haga clic en "Guardar Cambios"

#### Actualizar Estado de Orden de Compra

1. Navegue a **Compras > Órdenes de Compra**
2. Busque la orden de compra
3. Haga clic en "Editar"
4. Cambie el estado según el flujo:
   - **Pendiente**: Orden creada, aún no procesada
   - **En Almacén**: Mercancía recibida en almacén
   - **En Tránsito**: Mercancía en transporte
   - **Entregado**: Mercancía entregada completamente
   - **Cancelado**: Orden cancelada
5. Si aplica, registre la fecha de entrega real
6. Haga clic en "Guardar Cambios"

### Eliminar Registros

**Nota**: La eliminación de registros está restringida según el rol y el estado de los registros para mantener la integridad de los datos.

#### Eliminar un Proveedor

1. Navegue a **Compras > Proveedores**
2. Busque el proveedor
3. Haga clic en "Eliminar" (icono de papelera)
4. Confirme la eliminación en el diálogo de confirmación
5. El proveedor será eliminado del sistema

**Precaución**: No se pueden eliminar proveedores que tienen órdenes de compra asociadas.

#### Eliminar un Producto

1. Navegue a **Inventario > Productos**
2. Busque el producto
3. Haga clic en "Eliminar"
4. Confirme la eliminación

**Precaución**: No se pueden eliminar productos que están en órdenes de compra o inventarios activos.

### Consultar Información

#### Consultar Inventario por Almacén

1. Navegue a **Inventario > Inventario**
2. Utilice los filtros para seleccionar:
   - **Almacén**: Seleccione el almacén específico o "Todos"
   - **Producto**: Busque por nombre del producto
3. La tabla mostrará el stock actual, ubicación en estantería y última actualización
4. Haga clic en cualquier fila para ver detalles completos

#### Consultar Costes de Transporte

1. Navegue a **Costes > Transporte**
2. Utilice los filtros para:
   - **Vehículo**: Seleccione un vehículo específico
   - **Fecha**: Rango de fechas
   - **Ruta**: Origen y destino
3. La tabla mostrará desglose detallado de costes (combustible, peajes, mantenimiento, conductor)
4. El coste total se calcula automáticamente

#### Consultar Alertas Activas

1. Navegue a **Alertas**
2. Por defecto, se muestran las alertas con estado "Activa"
3. Utilice filtros para:
   - **Tipo**: Compra, Almacenamiento, Transporte, Distribución
   - **Estado**: Activa, Revisada, Resuelta, Descartada
   - **Fecha**: Rango de fechas
4. Cada alerta muestra:
   - Monto esperado vs real
   - Diferencia y porcentaje de exceso
   - Referencia de operación

### Generar Reportes

#### Generar Reporte PDF

1. Navegue a **Reportes > Reportes PDF**
2. Seleccione el tipo de reporte:
   - **Proveedores**: Listado completo de proveedores
   - **Productos**: Catálogo de productos
   - **Órdenes de Compra**: Resumen de pedidos
   - **Inventario**: Estado de inventarios
   - **Costes de Almacenamiento**: Análisis de costes operativos
   - **Costes de Transporte**: Análisis de costes de transporte
   - **Distribuciones**: Resumen de distribuciones
   - **Alertas**: Reporte de alertas de sobrecostes
3. Seleccione filtros opcionales (fecha, almacén, vehículo, etc.)
4. Haga clic en "Generar PDF"
5. El reporte se generará y descargará automáticamente

#### Generar Reporte Excel

1. Navegue a **Reportes > Reportes Excel**
2. Seleccione el tipo de reporte (mismas opciones que PDF)
3. Configure filtros según necesidad
4. Haga clic en "Generar Excel"
5. El archivo Excel se descargará automáticamente

### Exportar Datos

#### Exportar Tabla a Excel

En cualquier vista de tabla (proveedores, productos, etc.):

1. Utilice los filtros para mostrar solo los datos deseados
2. Haga clic en el botón "Exportar Excel" en la parte superior derecha de la tabla
3. El archivo Excel se generará con los datos actualmente visibles

---

## 2.6 Gestión de Usuarios

**Nota**: Esta sección es exclusiva para el rol de Administrador.

### Creación de Usuarios

1. Navegue a **Usuarios** (solo visible para Administrador)
2. Haga clic en "Nuevo Usuario"
3. Complete el formulario:
   - **Email**: Dirección de correo electrónico (debe ser única)
   - **Nombre**: Nombre completo del usuario
   - **Contraseña**: Contraseña temporal (mínimo 6 caracteres)
   - **Rol**: Seleccione el rol del usuario:
     - **Administrador**: Acceso total al sistema
     - **Operador Logístico**: Operaciones CRUD básicas
     - **Supervisor**: Monitoreo y auditoría
     - **Gerente**: Reportes ejecutivos y configuración
4. Haga clic en "Crear Usuario"
5. El usuario será notificado por email con sus credenciales de acceso

### Asignación de Roles

Los roles determinan el nivel de acceso de cada usuario:

#### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y roles
- Configuración del sistema
- Gestión de backups
- Auditoría completa

#### Operador Logístico
- CRUD de proveedores, productos, almacenes
- Creación y gestión de órdenes de compra
- Registro de costes de almacenamiento y transporte
- Gestión de distribuciones
- Actualización de inventarios

#### Supervisor
- Acceso de lectura a todas las vistas
- Gestión de estados de órdenes de compra
- Revisión y resolución de alertas
- Acceso a auditoría
- Generación de reportes

#### Gerente
- Acceso al dashboard ejecutivo
- Generación de reportes financieros
- Configuración de umbrales de alertas
- Análisis de tendencias
- Sin acceso a operaciones de modificación

### Modificación de Permisos

Para cambiar el rol de un usuario existente:

1. Navegue a **Usuarios**
2. Busque el usuario que desea modificar
3. Haga clic en "Editar"
4. Cambie el rol seleccionado en el menú desplegable
5. Haga clic en "Guardar Cambios"
6. El nuevo rol se aplicará inmediatamente

**Precaución**: Al reducir el nivel de acceso de un usuario, este perderá acceso inmediato a funcionalidades que ya no tiene permiso para usar.

### Eliminación de Usuarios

1. Navegue a **Usuarios**
2. Busque el usuario que desea eliminar
3. Haga clic en "Eliminar"
4. Confirme la eliminación

**Precaución**: No se pueden eliminar usuarios que tienen operaciones registradas en el sistema para mantener la integridad de la auditoría. En su lugar, se recomienda desactivar la cuenta cambiando su rol o contraseña.

---

## 2.7 Solución de Problemas Frecuentes

### Problemas de Acceso

#### No puedo iniciar sesión

**Causas posibles**:
- Credenciales incorrectas
- Cuenta desactivada
- Problema de conexión a internet

**Soluciones**:
1. Verifique que esté ingresando el email y contraseña correctos
2. Asegúrese de que las mayúsculas/minúsculas sean correctas
3. Verifique su conexión a internet
4. Si el problema persiste, contacte al Administrador

#### La página no carga correctamente

**Causas posibles**:
- Navegador no compatible
- Caché del navegador
- Problema de conexión

**Soluciones**:
1. Actualice su navegador a la versión más reciente
2. Limpiar el caché del navegador:
   - Chrome: Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
   - Firefox: Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
3. Intente acceder en modo incógnito
4. Verifique su conexión a internet

### Problemas de Operación

#### No puedo guardar un registro

**Causas posibles**:
- Campos obligatorios vacíos
- Formato de datos incorrecto
- Violación de restricciones de integridad

**Soluciones**:
1. Verifique que todos los campos marcados con * estén completos
2. Asegúrese de que los formatos sean correctos (fechas, números, emails)
3. Revise los mensajes de error específicos mostrados en pantalla
4. Si el error indica violación de restricción, verifique relaciones con otros registros

#### El cálculo de costes es incorrecto

**Causas posibles**:
- Datos de entrada incorrectos
- Error en configuración de umbrales

**Soluciones**:
1. Verifique los datos ingresados (cantidades, precios, kilómetros)
2. Revise la configuración de umbrales de alertas
3. Consulte el reporte de costes para identificar discrepancias
4. Si el problema persiste, contacte al soporte técnico

#### No puedo eliminar un registro

**Causas posibles**:
- El registro tiene dependencias
- El usuario no tiene permiso para eliminar

**Soluciones**:
1. Verifique si el registro está siendo utilizado en otras operaciones
2. Si es necesario, primero elimine o modifique los registros dependientes
3. Verifique que su rol tenga permisos de eliminación
4. Contacte al Administrador si necesita eliminar un registro con dependencias

### Problemas de Reportes

#### El reporte PDF no se genera

**Causas posibles**:
- Datos excesivos para el reporte
- Error en configuración de filtros

**Soluciones**:
1. Reduzca el rango de fechas o aplique filtros más específicos
2. Verifique que los filtros estén configurados correctamente
3. Intente generar el reporte con menos datos
4. Si el problema persiste, contacte al soporte técnico

#### El reporte Excel está vacío

**Causas posibles**:
- Filtros demasiado restrictivos
- No hay datos en el rango seleccionado

**Soluciones**:
1. Revise los filtros aplicados
2. Amplíe el rango de fechas
3. Verifique que existan datos para el reporte solicitado
4. Intente generar el reporte sin filtros

### Problemas de Alertas

#### No recibo alertas de sobrecostes

**Causas posibles**:
- Umbrales de alerta no configurados
- Costes registrados no exceden umbrales

**Soluciones**:
1. Navegue a Configuración > Alertas
2. Verifique que los umbrales estén configurados correctamente
3. Revise el porcentaje de exceso en las alertas existentes
4. Ajuste los umbrales según las necesidades de la organización

#### Las alertas son demasiado frecuentes

**Causas posibles**:
- Umbrales de alerta demasiado bajos
- Variaciones normales en costes

**Soluciones**:
1. Analice las alertas para identificar patrones
2. Ajuste los umbrales de alerta a valores más realistas
3. Considere diferentes umbrales para diferentes tipos de operaciones
4. Consulte con el Gerente para definir umbrales apropiados

### Problemas de Rendimiento

#### El sistema responde lentamente

**Causas posibles**:
- Gran cantidad de datos en la vista
- Problema de conexión a internet
- Sobrecarga del servidor

**Soluciones**:
1. Aplique filtros para reducir la cantidad de datos mostrados
2. Verifique su conexión a internet
3. Cierre otras pestañas o aplicaciones que consuman recursos
4. Si el problema persiste, contacte al soporte técnico

#### La página se congela

**Causas posibles**:
- Operación de larga duración en curso
- Error en el navegador

**Soluciones**:
1. Espere unos segundos para que la operación se complete
2. Si no responde, recargue la página (F5)
3. Limpiar el caché del navegador
4. Intente acceder en un navegador diferente

---

## 2.8 Soporte Técnico

### Información de Contacto

Para asistencia técnica, contacte a:

- **Email de Soporte**: soporte@logisticacostes.com
- **Teléfono**: +51 (044) 123-456
- **Horario de Atención**: Lunes a Viernes, 8:00 AM - 6:00 PM (hora local)
- **Tiempo de Respuesta**: Máximo 24 horas hábiles

### Proceso de Solicitud de Soporte

#### 1. Reportar el Problema

Al contactar al soporte técnico, proporcione la siguiente información:
- **Nombre completo**
- **Email de usuario**
- **Rol en el sistema**
- **Descripción detallada del problema**
- **Pasos para reproducir el problema** (si aplica)
- **Capturas de pantalla** (si es posible)
- **Hora y fecha aproximada del problema**

#### 2. Nivel de Prioridad

Los problemas se clasifican según su impacto:

- **Crítico**: Sistema no accesible, pérdida de datos, impacto en operaciones críticas
- **Alto**: Funcionalidad principal no disponible, impacto significativo en operaciones
- **Medio**: Funcionalidad secundaria no disponible, impacto moderado
- **Bajo**: Problemas menores, sin impacto en operaciones principales

#### 3. Seguimiento

Después de reportar un problema:
- Recibirá un número de ticket de seguimiento
- El equipo de soporte investigará el problema
- Será notificado sobre el progreso y resolución
- Podrá consultar el estado de su ticket en cualquier momento

### Recursos de Autoayuda

#### Documentación Adicional

- **Guía de Inicio Rápido**: Documento QUICKSTART.md para instalación y configuración básica
- **Memoria Descriptiva**: Documento MEMORIA_DESCRIPTIVA.md para detalles técnicos del sistema
- **README.md**: Documentación general del proyecto

#### Preguntas Frecuentes (FAQ)

Consulte la sección de FAQ en el portal del cliente para respuestas a preguntas comunes.

#### Tutoriales en Video

Acceda a la biblioteca de tutoriales en video en:
https://www.logisticacostes.com/tutoriales

### Actualizaciones del Sistema

El sistema se actualiza regularmente con:
- **Mejoras de funcionalidad**
- **Corrección de errores**
- **Actualizaciones de seguridad**
- **Nuevas características**

Los usuarios serán notificados con anticipación sobre actualizaciones programadas que puedan afectar la disponibilidad del sistema.

### Capacitación

Para usuarios nuevos, se ofrece capacitación personalizada:
- **Capacitación Básica**: 2 horas - Operaciones fundamentales
- **Capacitación Avanzada**: 4 horas - Funcionalidades avanzadas y reportes
- **Capacitación para Administradores**: 6 horas - Gestión completa del sistema

Solicite capacitación a través del email de soporte.

---

## Conclusión

Este manual proporciona una guía completa para el uso efectivo del Sistema de Gestión y Control de Costes Logísticos. Para cualquier pregunta adicional o problema no resuelto en este documento, no dude en contactar al equipo de soporte técnico.

El éxito en la implementación y uso del sistema depende de:
- **Capacitación adecuada** de todos los usuarios
- **Seguimiento de los procedimientos** descritos en este manual
- **Comunicación constante** con el equipo de soporte
- **Feedback continuo** para mejorar el sistema

¡Gracias por utilizar el Sistema de Gestión y Control de Costes Logísticos!
