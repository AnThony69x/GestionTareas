<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Panel de Tareas</h1>
      <div class="user-controls">
        <span class="username" v-if="userData">{{ userData.name }}</span>
        <button @click="cerrarSesion" class="logout-button">
          <span class="logout-icon">⇥</span> Cerrar sesión
        </button>
      </div>
    </header>

    <!-- Componente de alertas de tareas por vencer -->
    <TaskAlert :tasks="tasks" />

    <!-- Panel de creación de tareas -->
    <div class="task-panel">
      <h2>Crear nueva tarea</h2>
      <TaskForm @tarea-creada="fetchTasks" />
    </div>

    <!-- Panel de tareas existentes -->
    <div class="task-panel">
      <div class="panel-header">
        <h2>Mis tareas</h2>
        <div class="task-filters">
          <select v-model="filtroEstado" class="filter-select">
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completadas</option>
          </select>
        </div>
      </div>
      
      <!-- Mostrar mensaje cuando no hay tareas -->
      <div v-if="tareasFiltradas.length === 0" class="no-tasks-message">
        <p>No hay tareas que mostrar</p>
        <small v-if="filtroEstado !== 'todas'">Prueba cambiando los filtros</small>
      </div>
      
      <!-- Listado de tareas -->
      <TaskList 
        :tareas="tareasFiltradas" 
        @tarea-eliminada="fetchTasks"
        @tarea-actualizada="fetchTasks" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';
import TaskAlert from '../components/TaskAlert.vue';

const router = useRouter();
const tasks = ref([]);
const userData = ref(null);
const filtroEstado = ref('todas');
let checkInterval = null;
let isLoading = ref(true);

// Filtrar tareas por estado
const tareasFiltradas = computed(() => {
  if (filtroEstado.value === 'todas') {
    return tasks.value;
  }
  
  return tasks.value.filter(task => task.status === filtroEstado.value);
});

// Cerrar sesión
const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// Obtener información del usuario
const fetchUserData = async () => {
  try {
    const response = await api.get('/users/me');
    userData.value = response.data;
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    if (error.response?.status === 401) {
      cerrarSesion();
    }
  }
};

// Obtener tareas
const fetchTasks = async () => {
  isLoading.value = true;
  
  try {
    const response = await api.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    if (error.response?.status === 401) {
      cerrarSesion();
    }
  } finally {
    isLoading.value = false;
  }
};

// Eliminar tarea
const eliminarTarea = async (tarea) => {
  try {
    // Verificar que la tarea y su ID existan
    if (!tarea || !tarea.id) {
      console.error("No se puede eliminar: ID de tarea no válido");
      return;
    }
    
    await axios.delete(`/api/tasks/${tarea.id}`);
    cargarTareas();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};

// Inicialización al montar el componente
onMounted(() => {
  // Cargar datos iniciales
  fetchUserData();
  fetchTasks();
  
  // Comprobar tareas cada 30 minutos
  checkInterval = setInterval(() => {
    fetchTasks();
  }, 30 * 60 * 1000); // 30 minutos en milisegundos
});

// Limpieza al desmontar el componente
onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  color: #1f2937;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: #4b5563;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626;
}

.logout-icon {
  font-size: 1.2rem;
}

.task-panel {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-panel h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
  font-size: 1.25rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-filters {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: white;
}

.no-tasks-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background-color: #f3f4f6;
  border-radius: 6px;
}

.no-tasks-message p {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.no-tasks-message small {
  color: #9ca3af;
}
</style>
