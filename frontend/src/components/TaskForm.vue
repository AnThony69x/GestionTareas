<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h2 class="form-title">
        <span class="title-icon">✨</span>
        Nueva Tarea
      </h2>
      <p class="form-subtitle">Organiza tu día de manera efectiva</p>
    </div>

    <form @submit.prevent="handleCrearTarea" class="form-container">
      <div class="input-group">
        <label for="title" class="input-label">Título</label>
        <input
          id="title"
          v-model.trim="title"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          required
          class="input-field"
        />
      </div>

      <div class="input-group">
        <label for="description" class="input-label">Descripción</label>
        <textarea
          id="description"
          v-model.trim="description"
          placeholder="Agrega detalles adicionales..."
          class="textarea-field"
          rows="3"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="input-group">
          <label for="status" class="input-label">Estado</label>
          <select id="status" v-model="status" class="select-field">
            <option disabled value="">Seleccione estado</option>
            <option value="pendiente">📋 Pendiente</option>
            <option value="en_proceso">⚡ En Proceso</option>
            <option value="completada">✅ Completada</option>
          </select>
        </div>

        <div class="input-group">
          <label for="dueDate" class="input-label">Fecha límite</label>
          <input
            id="dueDate"
            v-model="dueDate"
            type="date"
            required
            class="input-field date-field"
          />
        </div>
      </div>

      <button type="submit" class="submit-button">
        <span class="button-icon">+</span>
        Crear Tarea
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

const emit = defineEmits(["tarea-creada"]);

const title = ref("");
const description = ref("");
const status = ref("pendiente");
const dueDate = ref("");
const errorMessage = ref("");

const handleCrearTarea = async () => {
  // Validación básica
  if (!title.value) {
    errorMessage.value = "El título es obligatorio";
    return;
  }
  
  if (!dueDate.value) {
    errorMessage.value = "La fecha de vencimiento es obligatoria";
    return;
  }
  
  try {
    // Enviar directamente sin depender de rutas de depuración
    const taskData = {
      title: title.value,
      description: description.value,
      dueDate: dueDate.value,
      status: status.value
    };
    
    console.log("Enviando tarea:", taskData);
    
    // Intentar crear la tarea normalmente
    const response = await api.post('/tasks', taskData);
    console.log("Tarea creada:", response.data);
    
    emit("tarea-creada");
    limpiarCampos();
  } catch (error) {
    console.error("Error al crear tarea:", error);
    errorMessage.value = "Error al crear la tarea";
    if (error.response?.data) {
      console.error("Detalles del error:", error.response.data);
    }
  }
};

const limpiarCampos = () => {
  title.value = "";
  description.value = "";
  status.value = "pendiente";
  dueDate.value = "";
};
</script>

<style scoped>
.form-wrapper {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08), 0 6px 15px rgba(0, 0, 0, 0.05);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-5deg) scale(1.1);
  }
  75% {
    transform: rotate(5deg) scale(1.1);
  }
}

.form-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 400;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-field,
.textarea-field,
.select-field {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #ffffff;
  outline: none;
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.date-field {
  color: #374151;
}

.date-field::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  background: #667eea;
  color: white;
}

.submit-button {
  align-self: flex-start;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.submit-button:active {
  transform: translateY(0);
}

.button-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .submit-button {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
