const { supabase } = require('../config/supabase');

// Middleware para verificar el token JWT
module.exports = async (req, res, next) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ msg: "Acceso denegado. Token no proporcionado." });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ msg: "Formato de token incorrecto" });
    }

    // Verificar el token usando Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.log("Error al verificar token:", error?.message);
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }

    // Adjuntar la información del usuario a la solicitud
    req.user = {
      id: data.user.id,
      email: data.user.email
    };

    next();
  } catch (err) {
    console.error("Error en middleware de autenticación:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
