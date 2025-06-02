const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { supabase } = require("./config/supabase");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Verificación de conexión a Supabase
const checkSupabaseConnection = async () => {
  try {
    // Simple consulta para verificar conexión
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Conexión a Supabase establecida correctamente');
  } catch (err) {
    console.warn('No se pudo verificar la conexión a Supabase:', err.message);
    console.log('Verifica tus credenciales y que la tabla "users" exista');
  }
};

// Rutas
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

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
  checkSupabaseConnection();
});
