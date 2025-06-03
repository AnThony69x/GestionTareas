const { supabase } = require('../config/supabase');
const Joi = require("joi");
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Esquema de validación sin restricción de fecha
const taskSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'El título es obligatorio',
    'any.required': 'El título es obligatorio',
  }),
  description: Joi.string().allow('').optional(),
  // Permitir cualquier fecha válida
  dueDate: Joi.date().optional().messages({
    'date.base': 'La fecha debe tener un formato válido',
  }),
  status: Joi.string()
    .valid('pendiente', 'en_proceso', 'completada')
    .default('pendiente')
    .optional(),
  priority: Joi.string()
    .valid('alta', 'media', 'baja')
    .default('media')
    .optional()
});

// Controlador para crear tarea
const createTask = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      console.log('Error de validación:', error.details);
      return res.status(400).json({ msg: 'Datos inválidos', detalles: error.details });
    }

    const userId = req.user.id;
    const { title, description, dueDate, status, priority } = value;

    // Crear tarea en Supabase
    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          status: status || 'pendiente',
          due_date: dueDate,
          user_id: userId,
          priority: priority || 'media'
        }
      ])
      .select();

    if (insertError) {
      console.error('Error al crear tarea:', insertError);
      throw insertError;
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error en createTask:', err);
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

// Función de eliminar tarea mejorada
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    
    // Validar que exista un ID válido
    if (!taskId || taskId === 'undefined') {
      return res.status(400).json({ 
        msg: 'ID de tarea inválido o no proporcionado' 
      });
    }
    
    // Verificar que la tarea existe y pertenece al usuario
    const { data: existingTask, error: findError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingTask) {
      console.log('Tarea no encontrada:', taskId, 'para usuario:', userId);
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }
    
    // Eliminar la tarea
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
    
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
