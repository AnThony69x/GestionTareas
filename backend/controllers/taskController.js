const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
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
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Tarea no encontrada" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar tarea" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: "Tarea no encontrada" });
    res.json({ msg: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
