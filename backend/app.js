const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Cargar variables de entorno y conectar a la base de datos
dotenv.config();
connectDB();
// Importar rutas y middlewares
const app = express();
app.use(cors());
app.use(express.json());
// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
// Manejo de errores
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
