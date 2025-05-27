<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title">Crea tu cuenta</h2>
        <p class="auth-subtitle">Comienza a organizar tus tareas</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Nombre completo</label>
          <input
            v-model="formData.name"
            id="name"
            type="text"
            placeholder="Ej: Juan Pérez"
            required
            :class="{ 'input-error': errors.name }"
            @input="clearError('name')"
          />
          <span v-if="errors.name" class="error-message">{{
            errors.name
          }}</span>
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            v-model="formData.email"
            id="email"
            type="email"
            placeholder="tu@email.com"
            required
            :class="{ 'input-error': errors.email }"
            @input="clearError('email')"
          />
          <span v-if="errors.email" class="error-message">{{
            errors.email
          }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input
              v-model="formData.password"
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
              <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"
                >👁️</i
              >
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{
            errors.password
          }}</span>
          <div class="password-hints">
            <span :class="{ valid: isPasswordValid.length }"
              >Mínimo 8 caracteres</span
            >
            <span :class="{ valid: isPasswordValid.number }">1 número</span>
            <span :class="{ valid: isPasswordValid.uppercase }"
              >1 mayúscula</span
            >
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Crear cuenta</span>
          <div v-else class="spinner"></div>
        </button>

        <div class="auth-footer">
          <p>
            ¿Ya tienes una cuenta?
            <router-link to="/login">Inicia sesión</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const formData = ref({
  name: "",
  email: "",
  password: "",
});

const errors = ref({
  name: "",
  email: "",
  password: "",
});

const showPassword = ref(false);
const isSubmitting = ref(false);
const serverError = ref("");

const isPasswordValid = computed(() => {
  return {
    length: formData.value.password.length >= 8,
    number: /\d/.test(formData.value.password),
    uppercase: /[A-Z]/.test(formData.value.password),
  };
});

const validateForm = () => {
  let isValid = true;

  // Validar nombre
  if (!formData.value.name.trim()) {
    errors.value.name = "El nombre es requerido";
    isValid = false;
  } else if (formData.value.name.length < 3) {
    errors.value.name = "El nombre debe tener al menos 3 caracteres";
    isValid = false;
  }

  // Validar email
  if (!formData.value.email) {
    errors.value.email = "El correo electrónico es requerido";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.value.email)) {
    errors.value.email = "Ingresa un correo electrónico válido";
    isValid = false;
  }

  // Validar contraseña
  if (!formData.value.password) {
    errors.value.password = "La contraseña es requerida";
    isValid = false;
  } else if (!isPasswordValid.value.length) {
    errors.value.password = "La contraseña debe tener al menos 8 caracteres";
    isValid = false;
  } else if (
    !isPasswordValid.value.number ||
    !isPasswordValid.value.uppercase
  ) {
    errors.value.password = "La contraseña debe contener números y mayúsculas";
    isValid = false;
  }

  return isValid;
};

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  if (serverError.value) {
    serverError.value = "";
  }
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  serverError.value = "";

  try {
    await api.post("/auth/register", {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    });

    router.push("/login");
  } catch (error) {
    const message = error.response?.data?.msg || "Error en el registro";

    if (error.response?.status === 400) {
      // Manejar errores específicos del servidor
      if (message.includes("email")) {
        errors.value.email = message;
      } else if (message.includes("contraseña")) {
        errors.value.password = message;
      } else {
        serverError.value = message;
      }
    } else {
      serverError.value = message;
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  color: #2d3748;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #718096;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
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

.password-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
}

.password-hints span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.password-hints span.valid {
  color: #38a169;
}

.password-hints span.valid::before {
  content: "✓";
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  background-color: #3182ce;
}

.submit-btn:disabled {
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

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
  font-size: 0.95rem;
}

.auth-footer a {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.server-error {
  color: #e53e3e;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
}
</style>
