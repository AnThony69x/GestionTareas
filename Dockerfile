# Usa una imagen base de Node
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del backend
COPY backend/package*.json ./
RUN npm install

# Copia todo el backend (incluyendo dist/)
COPY backend/ ./

# Variable de entorno para Cloud Run
ENV PORT=8080
EXPOSE 8080

# Comando para ejecutar la app
CMD ["node", "app.js"]