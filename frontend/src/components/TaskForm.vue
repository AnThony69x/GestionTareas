<template>
  <form @submit.prevent="crearTarea" class="task-form">
    <div class="form-group">
      <label for="title">Título</label>
      <input v-model="title" type="text" id="title" placeholder="Título de la tarea" required />
    </div>
    
    <div class="form-group">
      <label for="description">Descripción</label>
      <textarea 
        v-model="description" 
        id="description" 
        placeholder="Descripción detallada de la tarea"
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="status">Estado</label>
      <select v-model="status" id="status">
        <option value="pendiente">Pendiente</option>
        <option value="en_proceso">En Proceso</option>
        <option value="completada">Completada</option>
      </select>
    </div>
    
    <!-- Fecha con validación (permite fecha actual) -->
    <div class="form-group">
      <label for="dueDate">Fecha de vencimiento</label>
      <input 
        v-model="dueDate" 
        type="date" 
        id="dueDate"
        :min="fechaMinima" 
        required 
        @change="validarFecha" 
      />
      <small v-if="fechaError" class="error-text">{{ fechaError }}</small>
    </div>
    
    <button 
      type="submit" 
      class="submit-button" 
      :disabled="!formularioValido || isSubmitting"
    >
      <span v-if="isSubmitting" class="spinner"></span>
      <span v-else>Crear tarea</span>
    </button>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const emit = defineEmits(['tarea-creada'])

const title = ref('')
const description = ref('')
const status = ref('pendiente')
const dueDate = ref('')
const fechaError = ref('')
const isSubmitting = ref(false)

// Corregir la función para obtener la fecha mínima en formato YYYY-MM-DD
const fechaMinima = computed(() => {
  const hoy = new Date()
  const año = hoy.getFullYear()
  // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
  let mes = hoy.getMonth() + 1
  let dia = hoy.getDate()
  
  // Asegurar formato de dos dígitos
  mes = mes < 10 ? `0${mes}` : mes
  dia = dia < 10 ? `0${dia}` : dia
  
  return `${año}-${mes}-${dia}`
})

// Validar que la fecha no sea anterior a la actual
const validarFecha = () => {
  if (!dueDate.value) return

  const fechaSeleccionada = new Date(dueDate.value)
  fechaSeleccionada.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
  
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
  
  if (fechaSeleccionada < hoy) {
    fechaError.value = 'La fecha debe ser hoy o una fecha futura'
    dueDate.value = fechaMinima.value
  } else {
    fechaError.value = ''
  }
}

// Verificar si el formulario es válido
const formularioValido = computed(() => {
  return title.value && dueDate.value && !fechaError.value
})

const crearTarea = async () => {
  if (!formularioValido.value) return
  
  isSubmitting.value = true
  
  try {
    await api.post('/tasks', {
      title: title.value,
      description: description.value,
      status: status.value,
      dueDate: dueDate.value
    })
    
    // Limpiar formulario
    title.value = ''
    description.value = ''
    status.value = 'pendiente'
    dueDate.value = fechaMinima.value
    
    // Notificar creación exitosa
    emit('tarea-creada')
  } catch (error) {
    console.error('Error al crear la tarea:', error)
    alert('Error al crear la tarea: ' + (error.response?.data?.msg || 'Error desconocido'))
  } finally {
    isSubmitting.value = false
  }
}

// Inicializar fecha al montar el componente
onMounted(() => {
  // Establecer fecha actual como valor predeterminado
  dueDate.value = fechaMinima.value
})
</script>

<style scoped>
.task-form {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

input, textarea, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
