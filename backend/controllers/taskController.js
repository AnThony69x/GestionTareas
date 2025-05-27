const Joi = require("joi");
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Validación personalizada para asegurar fechas actuales o futuras
const todayOrFutureDate = (value, helpers) => {
  // Fecha actual al inicio del día
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fecha de entrada al inicio del día
  const inputDate = new Date(value);
  inputDate.setHours(0, 0, 0, 0);

  // Permitir la fecha actual o futuras, rechazar las pasadas
  if (inputDate < today) {
    return helpers.error("date.minToday", {
      reason: "debe ser hoy o una fecha futura",
    });
  }

  return value;
};

// Esquema de validación para tareas
const taskSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "string.empty": "El título es obligatorio",
      "any.required": "El título es obligatorio",
    }),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date()
    .custom(todayOrFutureDate)
    .required()
    .messages({
      "date.base": "La fecha de vencimiento debe ser una fecha válida",
      "any.required": "La fecha de vencimiento es obligatoria",
      "date.minToday": "La fecha de vencimiento debe ser hoy o una fecha futura",
    }),
  status: Joi.string()
    .valid("pendiente", "en_proceso", "completada")
    .default("pendiente")
    .optional(),
});

// Controlador para crear tarea
const createTask = async (req, res) => {
  // Validar datos de entrada
  const { error, value } = taskSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ msg: "Datos inválidos", detalles: error.details });
  }

  try {
    // Crear tarea asociada al usuario autenticado
    const task = await Task.create({ ...value, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    console.error("Error en crear tarea:", err);
    res.status(500).json({ msg: "Error al crear tarea" });
  }
};

// Controlador para obtener tareas
const getTasks = async (req, res) => {
  try {
    // Obtener tareas del usuario autenticado
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("Error en obtener tareas:", err);
    res.status(500).json({ msg: "Error al obtener tareas" });
  }
};

// Controlador para actualizar tarea
const updateTask = async (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de tarea no válido" });
  }

  // Validar datos de entrada
  const { error, value } = taskSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ msg: "Datos inválidos", detalles: error.details });
  }

  try {
    // Actualizar tarea si pertenece al usuario
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      value,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error en actualizar tarea:", err);
    res.status(500).json({ msg: "Error al actualizar tarea" });
  }
};

// Controlador para eliminar tarea
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de tarea no válido" });
  }

  try {
    // Eliminar tarea si pertenece al usuario
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    res.json({ msg: "Tarea eliminada" });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
