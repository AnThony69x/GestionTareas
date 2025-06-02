const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Verifica que las variables de entorno estén definidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY no definidas');
  process.exit(1);
}

// Cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar la conexión
const testConnection = async () => {
  try {
    console.log('Verificando conexión a Supabase...');
    
    // Verificar autenticación 
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.warn('Advertencia: No se pudo verificar la sesión de auth:', authError.message);
    }
    
    // Verificar acceso a tablas
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) {
      console.warn('Advertencia: No se pudo acceder a la tabla users:', error.message);
      return false;
    }
    
    console.log('Conexión a Supabase establecida correctamente');
    return true;
  } catch (err) {
    console.error('Error al verificar conexión con Supabase:', err.message);
    return false;
  }
};

module.exports = { supabase, testConnection };