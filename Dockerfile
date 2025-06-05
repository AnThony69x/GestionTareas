# Etapa 1: Construir el frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install
RUN npm run build

# Etapa 2: Configurar el backend
FROM node:18 AS backend
WORKDIR /app
COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Variable de entorno para Cloud Run
ENV PORT=80

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio del servidor
CMD ["node", "app.js"]
