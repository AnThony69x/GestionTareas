const { supabase } = require('../config/supabase');
const Joi = require('joi');

// Esquemas de validación
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Login usando Supabase Auth
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña son requeridos" });
    }
    
    console.log(`Intento de login con: ${email}`);
    
    // Paso 1: Intentar autenticar directamente con Supabase
    console.log("Paso 1: Autenticando con Supabase Auth");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // Si hay error, reportarlo detalladamente
    if (error) {
      console.error("Error en autenticación:", error.message);
      return res.status(400).json({ 
        msg: "Credenciales inválidas", 
        details: error.message 
      });
    }
    
    // Si no hay error pero tampoco hay datos de usuario
    if (!data || !data.user) {
      console.error("No se obtuvo usuario en la respuesta");
      return res.status(400).json({ 
        msg: "Error de autenticación: No se obtuvo usuario" 
      });
    }
    
    console.log("Usuario autenticado correctamente:", data.user.id);
    
    // Extrae datos esenciales para la respuesta
    res.json({
      msg: "Login exitoso",
      usuario: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0]
      },
      token: data.session.access_token
    });
    
  } catch (err) {
    console.error("Error no controlado en login:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Registro usando Supabase Auth
const register = async (req, res) => {
  try {
    // Validar entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: "Datos de registro inválidos", error: error.details });
    }

    const { name, email, password } = value;
    
    // Registrar usuario con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      console.log("Error en registro:", authError.message);
      return res.status(400).json({ msg: "Error al registrar usuario", error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ msg: "Error al crear usuario" });
    }

    // Guardar datos adicionales en la tabla users
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, // Usar el mismo ID que Supabase Auth
          name, 
          email 
        }
      ]);

    if (insertError) {
      console.log("Error al guardar datos adicionales:", insertError);
      // No fallamos el registro si esto falla, solo registramos el error
    }

    console.log("Usuario registrado exitosamente:", email);
    res.status(201).json({ msg: "Usuario registrado correctamente" });

  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Función de diagnóstico para verificar si un usuario existe
const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: "Se requiere un email" });
    }
    
    console.log(`Verificando existencia del usuario: ${email}`);
    
    // Intentamos obtener el usuario desde la autenticación de Supabase
    const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.listUsers();
    
    if (adminAuthError) {
      console.error("Error al listar usuarios:", adminAuthError);
      return res.status(500).json({ msg: "Error al verificar usuario" });
    }
    
    // Buscar el usuario por email
    const foundUser = adminAuthData.users.find(user => user.email === email);
    
    if (foundUser) {
      console.log("Usuario encontrado en Auth:", foundUser.id);
      
      // Verificar si existe en la tabla public.users
      const { data: publicUser, error: publicUserError } = await supabase
        .from('users')
        .select('*')
        .eq('id', foundUser.id)
        .single();
      
      return res.json({
        exists: true,
        auth: {
          id: foundUser.id,
          email: foundUser.email,
          created_at: foundUser.created_at
        },
        public: publicUserError ? null : publicUser,
        message: "Usuario encontrado"
      });
    }
    
    return res.json({
      exists: false,
      message: "Usuario no encontrado"
    });
  } catch (err) {
    console.error("Error en checkUser:", err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = {
  login,
  register,
  checkUser
};
