<template>
  <div class="register-container">
    <!-- Mensaje de éxito -->
    <div v-if="success" class="success-message">
      <h3>¡Usuario registrado correctamente!</h3>
      <p>Ahora puedes <router-link to="/login">iniciar sesión</router-link> con tus credenciales.</p>
    </div>
    
    <!-- Formulario de registro -->
    <div v-else>
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            placeholder="Tu nombre"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Crea una contraseña"
            minlength="6"
          />
          <small>La contraseña debe tener al menos 6 caracteres</small>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="Repite tu contraseña"
            :class="{ 'input-error': passwordsDoNotMatch }"
          />
          <p v-if="passwordsDoNotMatch" class="error-message">
            Las contraseñas no coinciden
          </p>
        </div>
        
        <button type="submit" :disabled="isLoading || passwordsDoNotMatch">
          {{ isLoading ? 'Registrando...' : 'Crear cuenta' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
      
      <div class="login-link">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const success = ref(false) // Estado para mostrar mensaje de éxito

// Validación de contraseñas
const passwordsDoNotMatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value
})

const handleRegister = async () => {
  // Verificar que las contraseñas coincidan
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  // Verificar longitud mínima de contraseña
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  error.value = ''
  isLoading.value = true
  
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    // Mostrar mensaje de éxito en la interfaz
    success.value = true
    
    // Opcional: Redirigir automáticamente después de unos segundos
    // setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    if (err.response?.data?.msg === 'Usuario ya existe') {
      error.value = 'El correo electrónico ya está registrado'
    } else {
      error.value = err.response?.data?.msg || 'Error al registrar usuario'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.input-error {
  border-color: #dc3545;
}

small {
  display: block;
  color: #6c757d;
  margin-top: 5px;
  font-size: 0.8rem;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #218838;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.login-link {
  text-align: center;
  margin-top: 15px;
}

/* Estilo para el mensaje de éxito */
.success-message {
  text-align: center;
  padding: 20px;
}

.success-message h3 {
  color: #28a745;
  margin-bottom: 10px;
}

.success-message a {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
}

.success-message a:hover {
  text-decoration: underline;
}
</style>
