const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Esquema de validación para registro
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Datos inválidos", detalles: error.details });

  try {
    const { name, email, password } = value;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Esquema de validación para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Datos inválidos", detalles: error.details });

  try {
    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = { register, login };
