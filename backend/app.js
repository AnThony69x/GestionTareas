const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { testConnection } = require("./config/supabase");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Gestión de Tareas funcionando con Supabase");
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
