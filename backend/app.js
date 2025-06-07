const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const { testConnection } = require("./config/supabase");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba de API
app.get("/api/status", (req, res) => {
  res.send("API de Gestión de Tareas funcionando con Supabase");
});

// Ruta para el frontend (SPA)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ 
    msg: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a Supabase antes de iniciar
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("No se pudo conectar con Supabase. El servidor se iniciará pero algunas funcionalidades podrían no funcionar.");
    }

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Modo de desarrollo: ${process.env.NODE_ENV !== 'production'}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
