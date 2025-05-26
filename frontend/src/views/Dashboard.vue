<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Panel de Tareas</h1>
      <!-- Botón de cierre de sesión -->
      <button @click="cerrarSesion" class="logout-button">
        Cerrar sesión
      </button>
    </div>

    <!-- Resto del contenido del dashboard -->
    <TaskForm @tarea-creada="fetchTasks" />
    <TaskList :tareas="tasks" @tarea-eliminada="fetchTasks" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';

const router = useRouter();
const tasks = ref([]);

// Función para cerrar sesión
const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// Obtener tareas del usuario
const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    // Si hay error 401 (no autorizado), cerrar sesión automáticamente
    if (error.response?.status === 401) {
      cerrarSesion();
    }
  }
};

// Cargar tareas al montar el componente
onMounted(fetchTasks);
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>
