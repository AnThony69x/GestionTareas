<!-- filepath: c:\Users\asus\Desktop\GestionTareas\frontend\src\components\TaskAlert.vue -->
<template>
  <div v-if="visibleTasks.length > 0" class="task-alerts-container">
    <div class="task-alert">
      <div class="alert-icon">⚠️</div>
      <div class="alert-content">
        <h3>Tareas próximas a vencer</h3>
        <ul class="task-list">
          <li v-for="task in visibleTasks" :key="task._id" class="task-item">
            <span class="task-title">{{ task.title }}</span>
            <span class="due-date" :class="getDueDateClass(task.dueDate)">
              {{ formatDueDate(task.dueDate) }}
            </span>
          </li>
        </ul>
      </div>
      <button @click="closeAlert" class="close-btn" title="Cerrar">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import notificationService from "../services/notificationService";

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
});

const showAlert = ref(true);

// Calcular tareas próximas a vencer
const upcomingTasks = computed(() => {
  return notificationService.checkUpcomingTasks(props.tasks);
});

// Mostrar solo si hay tareas y la alerta no ha sido cerrada
const visibleTasks = computed(() => {
  return showAlert.value ? upcomingTasks.value : [];
});

// Formatear la fecha de vencimiento para mostrarla
const formatDueDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate.getTime() === today.getTime()) {
    return "¡Vence hoy!";
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return "Vence mañana";
  } else {
    return `Vence el ${date.toLocaleDateString()}`;
  }
};

// Determinar la clase CSS según la fecha de vencimiento
const getDueDateClass = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate.getTime() === today.getTime()) {
    return "due-today";
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return "due-tomorrow";
  } else {
    return "due-soon";
  }
};

// Cerrar la alerta
const closeAlert = () => {
  showAlert.value = false;
};

// Vigilar cambios en las tareas para actualizar notificaciones
watch(
  () => props.tasks,
  (newTasks) => {
    if (showAlert.value) {
      notificationService.notifyUpcomingTasks(newTasks);
    }
  },
  { deep: true }
);

onMounted(async () => {
  // Solicitar permiso para notificaciones
  await notificationService.requestNotificationPermission();

  // Notificar tareas pendientes al cargar el componente
  if (upcomingTasks.value.length > 0) {
    notificationService.notifyUpcomingTasks(props.tasks);
  }
});
</script>

<style scoped>
.task-alerts-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 320px;
  max-width: 90vw;
}

.task-alert {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  margin-bottom: 10px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.alert-content {
  flex: 1;
  overflow: hidden;
}

.alert-content h3 {
  margin: 0 0 10px;
  font-size: 1rem;
  color: #856404;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 0;
}

.task-item:last-child {
  border-bottom: none;
}

.task-title {
  font-weight: 500;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.due-date {
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 10px;
  white-space: nowrap;
}

.due-today {
  background-color: #f8d7da;
  color: #721c24;
  font-weight: bold;
}

.due-tomorrow {
  background-color: #fff3cd;
  color: #856404;
}

.due-soon {
  background-color: #d1ecf1;
  color: #0c5460;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0 5px;
  color: #6c757d;
  cursor: pointer;
}

.close-btn:hover {
  color: #343a40;
}
</style>
