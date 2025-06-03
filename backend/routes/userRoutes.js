const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { supabase } = require('../config/supabase');

// Ruta para obtener datos del usuario actual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener datos del usuario desde la tabla users
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error al obtener usuario:', error);
      return res.status(500).json({ msg: 'Error al obtener información del usuario' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error en ruta /me:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;