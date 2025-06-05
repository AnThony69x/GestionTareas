const express = require("express");
const cors = require("cors");
const path = require('path'); // Añadir esta línea
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

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Ruta de prueba API (cambiada a /api)
app.get("/api", (req, res) => {
  res.send("API de Gestión de Tareas funcionando con Supabase");
});

// Servir el frontend en la ruta raíz y otras rutas no API
app.get(['/', '/*'], (req, res) => {
  // Excluir rutas que comienzan con /api
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ msg: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
  testConnection();
});
