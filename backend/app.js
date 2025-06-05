const path = require("path");
const express = require("express");
// ... otros imports

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ PRIMERO: Rutas de API
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Ruta de prueba API
app.get("/api", (req, res) => {
  res.json({ msg: "API funcionando" });
});

// ✅ DESPUÉS: Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ AL FINAL: Fallback para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Middleware de errores y servidor...