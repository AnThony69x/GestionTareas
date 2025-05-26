<template>
  <div>
    <h3>Mis Tareas</h3>
    <ul v-if="tareas.length" class="task-list">
      <li v-for="tarea in tareas" :key="tarea._id" class="task-item">
        <strong>{{ tarea.title }}</strong>
        <span :class="getStatusClass(tarea.status)">
          {{ formatStatus(tarea.status) }}
        </span>
        
        <!-- Mostrar descripción si existe -->
        <p v-if="tarea.description" class="description">
          {{ tarea.description }}
        </p>
        
        <div>Vence: {{ tarea.dueDate.slice(0,10) }}</div>
        <button @click="eliminar(tarea._id)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No tienes tareas ñaño, guardate una.</p>
  </div>
</template>

<script setup>
import api from '../services/api'

const props = defineProps({
  tareas: Array
})
const emit = defineEmits(['tarea-eliminada'])

const eliminar = async (id) => {
  try {
    await api.delete(`/tasks/${id}`)
    emit('tarea-eliminada')
  } catch (error) {
    console.error(error)
  }
}

// Función para formatear el estado
const formatStatus = (status) => {
  switch(status) {
    case 'pendiente': return 'Pendiente';
    case 'en_proceso': return 'En proceso';
    case 'completada': return 'Completada';
    default: return status;
  }
}

// Función para obtener la clase CSS según el estado
const getStatusClass = (status) => {
  switch(status) {
    case 'pendiente': return 'status-pending';
    case 'en_proceso': return 'status-in-progress';
    case 'completada': return 'status-completed';
    default: return '';
  }
}
</script>

<style scoped>
.task-list {
  list-style-type: none;
  padding: 0;
}

.task-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estilos para la descripción */
.description {
  margin: 0.8em 0;
  color: #555;
  font-style: italic;
}

/* Estilos para los diferentes estados */
.status-pending, 
.status-in-progress, 
.status-completed {
  display: inline-block;
  padding: 0.2em 0.6em;
  border-radius: 3px;
  margin-left: 0.5em;
  font-size: 0.8em;
  font-weight: bold;
}

.status-pending {
  background-color: #ffc107;
  color: #212529;
}

.status-in-progress {
  background-color: #17a2b8;
  color: white;
}

.status-completed {
  background-color: #28a745;
  color: white;
}

button {
  margin-top: 0.3em;
  padding: 0.3em 0.6em;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #a71d2a;
}
</style>
