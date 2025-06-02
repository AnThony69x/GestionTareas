// PATRÓN: Modelo (MVC) para Supabase
// Define funciones para interactuar con la tabla users en Supabase

const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Modelo de Usuario para Supabase
 * 
 * Estructura de tabla en Supabase:
 * - id: uuid (primary key, referencia a auth.users)
 * - name: text
 * - email: text (unique)
 * - created_at: timestamptz (auto-generado)
 * - updated_at: timestamptz (auto-generado)
 */
const User = {
  // Crear un nuevo usuario
  create: async (userData) => {
    const { name, email, id } = userData;
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id,
        name,
        email
      }])
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // Buscar usuario por email
  findByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 es "no se encontró ningún registro"
    return data;
  },
  
  // Buscar usuario por ID
  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  // Actualizar usuario
  update: async (id, updates) => {
    const { name, email } = updates;
    
    const updateData = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // Registrar usuario con autenticación de Supabase
  register: async (userData) => {
    const { name, email, password } = userData;
    
    // Crear usuario en auth.users a través de la API de autenticación
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (authError) throw authError;
    
    // Si la creación de autenticación fue exitosa, agregar a la tabla users
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          name,
          email
        }])
        .select();
        
      if (error) throw error;
      return { ...data[0], auth: authData };
    } catch (err) {
      console.error("Error al crear entrada en tabla users:", err);
      return { auth: authData }; // Devolver al menos los datos de autenticación
    }
  }
};

module.exports = User;
