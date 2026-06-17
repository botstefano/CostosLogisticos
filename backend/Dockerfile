FROM node:20-alpine

# postgresql-client provee pg_dump, usado por el módulo de copias de seguridad (RF18)
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/backups

# Ejecutar seed.js para inicializar la base de datos
RUN node src/database/seed.js

EXPOSE 4000

CMD ["node", "src/server.js"]
