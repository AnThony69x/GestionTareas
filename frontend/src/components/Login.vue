<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Bienvenido de vuelta</h2>
        <p>Ingresa tus credenciales para acceder</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="tu@email.com"
            required
            :class="{ 'input-error': errors.email }"
            @input="clearError('email')"
          />
          <span class="error-message" v-if="errors.email">{{
            errors.email
          }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input
              v-model="password"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              :class="{ 'input-error': errors.password }"
              @input="clearError('password')"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{
            errors.password
          }}</span>
        </div>

        <div class="form-options">
          <router-link to="/forgot-password" class="forgot-password"
            >¿Olvidaste tu contraseña?</router-link
          >
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Iniciar sesión</span>
          <div class="spinner" v-else></div>
        </button>

        <div class="login-footer">
          <p>
            ¿No tienes una cuenta?
            <router-link to="/register" class="register-link"
              >Regístrate</router-link
            >
          </p>
        </div>
      </form>

      <!-- Mensaje específico para email no confirmado -->
      <div v-if="emailNotConfirmed" class="email-confirmation-alert">
        <h3>⚠️ Correo no confirmado</h3>
        <p>Debes confirmar tu correo electrónico antes de iniciar sesión.</p>
        <p>Revisa tu bandeja de entrada o carpeta de spam.</p>
        <button @click="resendConfirmation" :disabled="resending">
          {{ resending ? 'Reenviando...' : 'Reenviar correo de confirmación' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errors = ref({
  email: "",
  password: "",
  general: "",
});
const emailNotConfirmed = ref(false);
const resending = ref(false);

const router = useRouter();

const validateForm = () => {
  let isValid = true;

  if (!email.value) {
    errors.value.email = "El correo electrónico es requerido";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = "Ingresa un correo electrónico válido";
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = "La contraseña es requerida";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = "La contraseña debe tener al menos 6 caracteres";
    isValid = false;
  }

  return isValid;
};

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errors.value.general = "";

  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    router.push("/dashboard");
  } catch (error) {
    const message = error.response?.data?.msg || "Error en el inicio de sesión";

    if (error.response?.status === 401) {
      errors.value.password = "Credenciales incorrectas";
    } else if (error.response?.data?.code === "email_not_confirmed") {
      emailNotConfirmed.value = true;
    } else {
      errors.value.general = message;
    }
  } finally {
    isLoading.value = false;
  }
};

const resendConfirmation = async () => {
  resending.value = true;
  try {
    await api.post("/auth/resend-confirmation", { email: email.value });
    alert("Correo de confirmación reenviado");
  } catch (error) {
    alert("Error al reenviar el correo");
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #2d3748;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #718096;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.input-error {
  border-color: #fc8181;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(252, 129, 129, 0.2);
}

.error-message {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: #4299e1;
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.login-button:hover {
  background-color: #3182ce;
}

.login-button:disabled {
  background-color: #bee3f8;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
  font-size: 0.95rem;
}

.register-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.email-confirmation-alert {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>
