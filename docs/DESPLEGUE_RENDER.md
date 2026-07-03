# Guía de Despliegue en Render

## Sistema de Gestión y Control de Costes Logísticos - Plaza Vea

---

## Requisitos Previos

- Cuenta en [Render](https://render.com)
- Repositorio en GitHub con el código del proyecto
- Archivo `render.yaml` configurado en la raíz del proyecto

---

## Pasos para Desplegar en Render

### 1. Preparar el Repositorio en GitHub

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Sistema de Gestión Logística Plaza Vea"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Push al repositorio
git push -u origin master
```

### 2. Crear Cuenta en Render

1. Visita [https://render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub
3. Autoriza Render a acceder a tus repositorios

### 3. Desplegar con render.yaml

Render detectará automáticamente el archivo `render.yaml` en tu repositorio:

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Blueprints"**
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente el archivo `render.yaml`
5. Haz clic en **"Apply"** para crear los servicios

Esto creará automáticamente:
- **PostgreSQL Database**: Base de datos del sistema
- **Backend API**: Servidor Node.js en puerto 4000
- **Frontend**: Aplicación React en puerto 5173

### 4. Configurar Variables de Entorno

Render configurará automáticamente las variables de entorno desde `render.yaml`:

**Backend:**
- `PORT`: 4000
- `NODE_ENV`: production
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Conectados al servicio de PostgreSQL
- `JWT_SECRET`: Generado automáticamente por Render
- `JWT_EXPIRES_IN`: 8h
- `DEFAULT_ALERT_THRESHOLD`: 10

**Frontend:**
- `VITE_API_URL`: URL del backend (configurada automáticamente por Render)

### 5. Verificar el Despliegue

**Verificar servicios:**
1. En el dashboard de Render, verás 3 servicios:
   - `logistic-cost-system-db` (PostgreSQL)
   - `logistic-cost-system-backend` (Web Service)
   - `logistic-cost-system-frontend` (Web Service)

2. Haz clic en cada servicio para ver:
   - Estado (Deploying, Live, etc.)
   - Logs
   - URL del servicio

**Verificar health check:**
```bash
# Backend health check
curl https://logistic-cost-system-backend.onrender.com/api/health
# Salida esperada: {"status":"ok","timestamp":"..."}
```

### 6. Acceder al Sistema

Una vez que todos los servicios estén en estado "Live":

- **Frontend**: https://logistic-cost-system-frontend.onrender.com
- **Backend API**: https://logistic-cost-system-backend.onrender.com/api
- **PostgreSQL**: Acceso interno (no público)

### 7. Usuarios Demo Precargados

El sistema se inicializa automáticamente con los siguientes usuarios:

| Email | Password | Rol |
|---|---|---|
| admin@logistica.com | admin123 | Administrador |
| operador@logistica.com | oper123 | Operador Logístico |
| supervisor@logistica.com | sup123 | Supervisor |
| gerente@logistica.com | ger123 | Gerente |

---

## Solución de Problemas

### El servicio no inicia

**Verificar logs:**
1. Haz clic en el servicio en el dashboard de Render
2. Ve a la sección "Logs"
3. Busca errores en los logs

**Causas comunes:**
- Error de conexión a la base de datos
- Variables de entorno incorrectas
- Error en el script de inicialización

### La base de datos no se inicializa

**Solución:**
1. Verifica que el Dockerfile del backend ejecute `seed.js`
2. Revisa los logs del servicio backend
3. Si es necesario, ejecuta manualmente el seed desde el shell de Render

### El frontend no se conecta al backend

**Verificar:**
1. Que la variable `VITE_API_URL` esté configurada correctamente
2. Que el backend esté en estado "Live"
3. Que no haya errores de CORS en los logs del backend

### El servicio se reinicia constantemente

**Causas comunes:**
- Memoria insuficiente (free tier tiene 512MB RAM)
- Timeout de ejecución
- Error en el código

**Solución:**
- Optimizar el código para usar menos memoria
- Aumentar el plan a paid tier si es necesario

---

## Límites del Free Tier

**750 horas/mes** de ejecución por servicio
**512MB RAM** por servicio
**PostgreSQL**: 90 días de inactividad antes de dormir
**Dominio**: Subdominio gratuito `.onrender.com`

---

## Actualizar el Despliegue

Para actualizar el sistema después de cambios en el código:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push
```

Render detectará automáticamente el push y redeployará los servicios afectados.

---

## Backups

Render realiza backups automáticos de PostgreSQL. Para backups manuales:

1. Ve al servicio de PostgreSQL en el dashboard de Render
2. Haz clic en "Backups"
3. Crea un backup manual

---

## Eliminar Servicios

Para eliminar los servicios de Render:

1. Ve al dashboard de Render
2. Haz clic en cada servicio
3. Haz clic en "Settings"
4. Haz clic en "Delete Service"

---

## Soporte

Para problemas específicos de Render:
- [Documentación de Render](https://render.com/docs)
- [Status de Render](https://status.render.com)
- [Soporte de Render](https://render.com/support)

---

## Conclusión

El sistema está ahora desplegado en Render y accesible desde cualquier lugar con conexión a internet. Los datos de simulación de Plaza Vea están cargados y listos para usar.
