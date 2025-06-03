const express = require("express");
const router = express.Router();
const { register, login, checkUser } = require("../controllers/authController");
const { getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas para autenticación
router.post("/register", register);
router.post("/login", login);
router.post('/check-user', checkUser);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Ruta para obtener el usuario actual
router.get('/me', getCurrentUser);

module.exports = router;

