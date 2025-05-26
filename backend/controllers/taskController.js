const Joi = require("joi");
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Esquema para crear o actualizar tareas
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().optional()
});

const createTask = async (req, res) => {
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Datos inválidos", detalles: error.details });

  try {
    const task = await Task.create({ ...value, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error al crear tarea" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener tareas" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de tarea no válido" });
  }

  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: "Datos inválidos", detalles: error.details });

  try {
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
    res.status(500).json({ msg: "Error al actualizar tarea" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de tarea no válido" });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    res.json({ msg: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
