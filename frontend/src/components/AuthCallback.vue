// frontend/src/components/AuthCallback.vue

<template>
  <div class="auth-callback-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Verificando tu cuenta...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <h2>⚠️ {{ errorMessage }}</h2>
      <p>Puedes solicitar un nuevo enlace de verificación:</p>
      <button @click="resendVerification" class="btn primary">
        Solicitar nuevo enlace
      </button>
      <button @click="router.push('/login')" class="btn secondary">
        Volver al inicio de sesión
      </button>
    </div>
    
    <div v-else class="success-container">
      <div class="success-icon">✅</div>
      <h1>¡Bienvenido a TaskMaster Pro!</h1>
      <h2>Tu cuenta ha sido verificada con éxito</h2>
      <p>Ya puedes comenzar a utilizar nuestra aplicación para gestionar tus tareas.</p>
      
      <button @click="router.push('/dashboard')" class="btn primary">
        Ir al Dashboard
      </button>
      
      <div v-if="countdown > 0" class="redirect-message">
        Serás redirigido automáticamente en {{ countdown }} segundos
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const error = ref(false);
const errorMessage = ref('');
const loading = ref(true);
const countdown = ref(5);

onMounted(() => {
  // Verificar si hay parámetros de error en la URL
  if (route.query.error === 'access_denied' && route.query.error_code === 'otp_expired') {
    error.value = true;
    errorMessage.value = 'El enlace de verificación ha expirado. Por favor, solicita uno nuevo.';
    loading.value = false;
    return;
  }
  
  // Procesar hash para obtener tokens (caso exitoso)
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      // Guardar token y cuenta regresiva para redirigir
      localStorage.setItem('token', accessToken);
      loading.value = false;
      
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          router.push('/dashboard');
        }
      }, 1000);
    }
  }
});

const resendVerification = async () => {
  // Lógica para reenviar correo...
};
</script>

<style scoped>
.auth-callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.loading,
.error-container,
.success-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 2rem 3rem;
  max-width: 550px;
  width: 100%;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #374151;
}

p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  text-decoration: none;
}

.btn.primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn.primary:hover {
  background-color: #2563eb;
}

.btn.secondary {
  background-color: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn.secondary:hover {
  background-color: #3b82f6;
  color: white;
}

.redirect-message {
  margin-top: 1.5rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

/* Animación de checkmark */
.animation-container {
  margin: 30px 0;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4bb71b;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #4bb71b;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  position: relative;
  margin: 0 auto;
  background-color: #f5f7fa;
}

.checkmark {
  width: 40px;
  height: 80px;
  border-right: 8px solid #4bb71b;
  border-top: 8px solid #4bb71b;
  margin: 0 auto;
  transform: rotate(135deg);
  transform-origin: center;
  animation: checkmark 0.6s ease-in-out forwards;
  opacity: 0;
}

@keyframes checkmark {
  0% {
    opacity: 0;
    height: 0;
    width: 0;
  }
  40% {
    opacity: 1;
    height: 0;
    width: 40px;
  }
  100% {
    opacity: 1;
    height: 80px;
    width: 40px;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>