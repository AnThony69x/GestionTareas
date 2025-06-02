const { supabase } = require('../config/supabase');
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
    const { title, description, priority, dueDate, status } = req.body;
    const userId = req.user.id;

    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          priority,
          due_date: dueDate,
          status,
          user_id: userId
        }
      ])
      .select();

    if (insertError) throw insertError;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error al crear tarea:', err);
    res.status(500).json({ msg: 'Error al crear la tarea' });
  }
};

// Obtener todas las tareas de un usuario
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error al obtener tareas:', err);
    res.status(500).json({ msg: 'Error al obtener tareas' });
  }
};

// Obtener una tarea por su ID
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error al obtener tarea:', err);
    res.status(500).json({ msg: 'Error al obtener la tarea' });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, priority, dueDate, status } = req.body;

    // Verificar que la tarea pertenece al usuario
    const { data: existingTask, error: findError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (findError || !existingTask) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    // Actualizar la tarea
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title,
        description,
        priority,
        due_date: dueDate,
        status,
        updated_at: new Date()
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    res.status(500).json({ msg: 'Error al actualizar la tarea' });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Verificar que la tarea pertenece al usuario
    const { data: existingTask, error: findError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (findError || !existingTask) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    // Eliminar la tarea
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ msg: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
    res.status(500).json({ msg: 'Error al eliminar la tarea' });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
