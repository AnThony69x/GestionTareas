<template>
  <div class="tasks-wrapper">
    <div class="tasks-header">
      <h3 class="tasks-title">
        <span class="header-icon">📋</span>
        Mis Tareas
        <span v-if="tareas.length" class="task-count">{{ tareas.length }}</span>
      </h3>
    </div>

    <div v-if="tareas.length" class="task-grid">
      <div
        v-for="tarea in tareas"
        :key="tarea._id"
        class="task-card"
        :class="getTaskCardClass(tarea.status)"
      >
        <div class="task-header">
          <h4 class="task-title">{{ tarea.title }}</h4>
          <span :class="getStatusClass(tarea.status)" class="status-badge">
            {{ getStatusIcon(tarea.status) }} {{ formatStatus(tarea.status) }}
          </span>
        </div>

        <p v-if="tarea.description" class="task-description">
          {{ tarea.description }}
        </p>

        <div class="task-footer">
          <div class="due-date">
            <span class="date-icon">📅</span>
            <span class="date-text">{{ formatDate(tarea.dueDate) }}</span>
            <span v-if="isOverdue(tarea.dueDate)" class="overdue-indicator"
              >¡Vencida!</span
            >
          </div>

          <button @click="eliminarTarea(tarea.id)" class="delete-button">
            <span class="delete-icon">🗑️</span>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h4 class="empty-title">¡Todo despejado!</h4>
      <p class="empty-message">
        No tienes tareas pendientes. ¡Perfecto momento para crear una nueva!
      </p>
    </div>
  </div>
</template>

<script setup>
import api from "../services/api";

const props = defineProps({
  tareas: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["tarea-eliminada"]);

const eliminarTarea = async (id) => {
  try {
    // Validar que el ID exista
    if (!id) {
      console.error("Error: ID de tarea no proporcionado");
      return;
    }

    await api.delete(`/tasks/${id}`);
    emit("tarea-eliminada");
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};

const formatStatus = (status) => {
  const map = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    completada: "Completada",
  };
  return map[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    pendiente: "⏳",
    en_proceso: "⚡",
    completada: "✅",
  };
  return icons[status] || "📋";
};

const formatDate = (date) => {
  const taskDate = new Date(date);
  const today = new Date();
  const diffTime = taskDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays === -1) return "Ayer";
  if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
  if (diffDays < 7) return `En ${diffDays} días`;

  return taskDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year:
      taskDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const isOverdue = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  return taskDate < today;
};

const getStatusClass = (status) => {
  const classes = {
    pendiente: "status-pending",
    en_proceso: "status-in-progress",
    completada: "status-completed",
  };
  return classes[status] || "";
};

const getTaskCardClass = (status) => {
  const classes = {
    pendiente: "card-pending",
    en_proceso: "card-in-progress",
    completada: "card-completed",
  };
  return classes[status] || "";
};
</script>

<style scoped>
.tasks-wrapper {
  margin-top: 2rem;
}

.tasks-header {
  margin-bottom: 1.5rem;
}

.tasks-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 1.3rem;
}

.task-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
  margin-left: 0.5rem;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: all 0.3s ease;
}

.card-pending::before {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.card-in-progress::before {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

.card-completed::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.task-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-pending {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  color: #92400e;
}

.status-in-progress {
  background: linear-gradient(135deg, #cffafe, #06b6d4);
  color: #0c4a6e;
}

.status-completed {
  background: linear-gradient(135deg, #d1fae5, #10b981);
  color: #065f46;
}

.task-description {
  color: #6b7280;
  font-style: italic;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
}

.date-icon {
  font-size: 0.9rem;
}

.overdue-indicator {
  background: linear-gradient(135deg, #fee2e2, #ef4444);
  color: #991b1b;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-button {
  background: linear-gradient(135deg, #fee2e2, #ef4444);
  color: #991b1b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.delete-button:hover {
  background: linear-gradient(135deg, #fecaca, #dc2626);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.delete-icon {
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(145deg, #f8fafc, #ffffff);
  border-radius: 20px;
  border: 2px dashed #cbd5e1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-message {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .task-grid {
    grid-template-columns: 1fr;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .task-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .delete-button {
    align-self: stretch;
    justify-content: center;
  }

  .tasks-title {
    font-size: 1.3rem;
  }
}

/* Animaciones sutiles */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-card {
  animation: slideInUp 0.3s ease-out;
}
</style>
