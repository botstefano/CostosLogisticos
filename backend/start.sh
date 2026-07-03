#!/bin/sh

# Esperar a que la base de datos esté disponible
if [ -n "$DB_HOST" ]; then
  echo "Esperando a que la base de datos esté disponible..."
  while ! nc -z "$DB_HOST" 5432; do
    sleep 1
  done
  echo "Base de datos disponible."

  # Ejecutar seed.js para inicializar la base de datos
  echo "Inicializando base de datos..."
  node src/database/seed.js
fi

# Iniciar el servidor
echo "Iniciando servidor..."
node src/server.js
