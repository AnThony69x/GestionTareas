const jwt = require("jsonwebtoken");

// Middleware para verificar el token JWT
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error al verificar token JWT:", err);
    res.status(401).json({ msg: "Token inválido" });
  }
};
