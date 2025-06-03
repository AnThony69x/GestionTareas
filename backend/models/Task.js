// PATRÓN: Modelo (MVC) para Supabase
// Define funciones para interactuar con la tabla tasks en Supabase

const { supabase } = require('../config/supabase');

const Task = {
  // Crear una nueva tarea
  create: async (taskData) => {
    const { title, description, status = 'pendiente', dueDate, userId } = taskData;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        status,
        due_date: dueDate,
        user_id: userId
      }])
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // Obtener todas las tareas de un usuario
  findByUser: async (userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Buscar una tarea por ID
  findById: async (taskId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Buscar una tarea por ID y asegurar que pertenece a un usuario específico
  findByIdAndUser: async (taskId, userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Actualizar una tarea
  update: async (taskId, userId, updates) => {
    const { title, description, status, dueDate } = updates;
    
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { due_date: dueDate }),
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // Eliminar una tarea
  delete: async (taskId, userId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);
      
    if (error) throw error;
    return true;
  },
  
  // Obtener estadísticas de tareas por usuario
  getStats: async (userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const stats = {
      total: data.length,
      pendiente: data.filter(task => task.status === 'pendiente').length,
      en_proceso: data.filter(task => task.status === 'en_proceso').length,
      completada: data.filter(task => task.status === 'completada').length
    };
    
    return stats;
  }
};

module.exports = Task;
