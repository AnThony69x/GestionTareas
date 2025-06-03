// controllers/userController.js
const { supabase } = require('../config/supabase');

// Obtener información del usuario actual
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener datos del usuario desde la tabla users
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error al obtener usuario:', error || 'No encontrado');
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error en getCurrentUser:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = {
  getCurrentUser
};