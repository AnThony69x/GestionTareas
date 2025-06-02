import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no configuradas');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

// En el componente de registro
import { supabase } from '../services/api';

async function registrarUsuario() {
  try {
    // Registrar con Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { name: name.value }
      }
    });

    if (error) throw error;
    
    // Éxito
    console.log("Usuario registrado:", data);
    // Redirigir o mostrar mensaje de éxito
  } catch (err) {
    // Manejar errores específicos
    if (err.message.includes("already registered")) {
      alert("Este correo ya está registrado");
    } else {
      alert("Error al registrar: " + err.message);
    }
  }
}