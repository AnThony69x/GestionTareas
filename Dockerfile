# Etapa 1: Construir el frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Configurar el backend
FROM node:18 AS backend
WORKDIR /app

# Copiar archivos del backend
COPY backend/package*.json ./
RUN npm install

# Copiar el resto del código del backend
COPY backend/ ./

# Copiar los archivos construidos del frontend al directorio público del backend
COPY --from=frontend-builder /app/frontend/dist ./public

# Variable de entorno para Cloud Run
ENV PORT=8080

# Exponer el puerto
EXPOSE 8080

# Comando de inicio del servidor
CMD ["node", "app.js"]