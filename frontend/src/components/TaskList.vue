<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <h2 class="tasks-title">Mis Tareas</h2>
      <div class="tasks-actions">
        <button @click="showFilters = !showFilters" class="filter-btn">
          <i>🔍</i> Filtros
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="showFilters" class="filters-panel">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="statusFilter" @change="applyFilters">
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Fecha:</label>
        <select v-model="dateFilter" @change="applyFilters">
          <option value="">Todas</option>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="overdue">Vencidas</option>
        </select>
      </div>
      <button @click="resetFilters" class="reset-btn">Limpiar filtros</button>
    </div>

    <!-- Lista de tareas -->
    <div v-if="filteredTasks.length" class="task-list">
      <div
        v-for="tarea in filteredTasks"
        :key="tarea._id"
        class="task-card"
        :class="{
          'task-urgent': isUrgent(tarea.dueDate),
          'task-completed': tarea.status === 'completada',
        }"
      >
        <div class="task-main">
          <div class="task-header">
            <h3 class="task-title">{{ tarea.title }}</h3>
            <span :class="['task-status', getStatusClass(tarea.status)]">
              {{ formatStatus(tarea.status) }}
            </span>
          </div>

          <p v-if="tarea.description" class="task-description">
            {{ tarea.description }}
          </p>

          <div class="task-dates">
            <span><i>📅</i> {{ formatDate(tarea.dueDate) }}</span>
            <span v-if="tarea.createdAt"
              ><i>⏱️</i> Creada: {{ formatDate(tarea.createdAt) }}</span
            >
          </div>
        </div>

        <div class="task-actions">
          <button @click="editTask(tarea._id)" class="edit-btn" title="Editar">
            <i>✏️</i>
          </button>
          <button
            @click="confirmDelete(tarea._id)"
            class="delete-btn"
            title="Eliminar"
          >
            <i>🗑️</i>
          </button>
          <button
            v-if="tarea.status !== 'completada'"
            @click="updateStatus(tarea._id, 'completada')"
            class="complete-btn"
            title="Completar"
          >
            <i>✔️</i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <i>📭</i>
      <p>No tienes tareas carnal, ¡agrega una nueva!</p>
      <router-link to="/tasks/new" class="add-btn">
        <i>➕</i> Crear mi primera tarea
      </router-link>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>¿Seguro que quieres eliminar esta tarea?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-btn">
            Cancelar
          </button>
          <button @click="deleteTask(deleteTaskId)" class="confirm-delete-btn">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  tareas: Array,
});
const emit = defineEmits(["tarea-eliminada", "tarea-actualizada"]);

// Filtros
const showFilters = ref(false);
const statusFilter = ref("");
const dateFilter = ref("");
const filteredTasks = computed(() => {
  let tasks = [...props.tareas];

  // Filtrar por estado
  if (statusFilter.value) {
    tasks = tasks.filter((t) => t.status === statusFilter.value);
  }

  // Filtrar por fecha
  if (dateFilter.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks = tasks.filter((t) => {
      const dueDate = new Date(t.dueDate);

      switch (dateFilter.value) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return dueDate >= today && dueDate <= weekEnd;
        case "month":
          return (
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
          );
        case "overdue":
          return dueDate < today && t.status !== "completada";
        default:
          return true;
      }
    });
  }

  // Ordenar por fecha de vencimiento (las más cercanas primero)
  return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
});

// Modal de eliminación
const showDeleteModal = ref(false);
const deleteTaskId = ref(null);

// Funciones
const formatStatus = (status) => {
  const statusMap = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    completada: "Completada",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const classMap = {
    pendiente: "pending",
    en_proceso: "in-progress",
    completada: "completed",
  };
  return classMap[status] || "";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const isUrgent = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const taskDate = new Date(dueDate);
  const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
  return diffDays <= 2 && diffDays >= 0;
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente a través del computed
};

const resetFilters = () => {
  statusFilter.value = "";
  dateFilter.value = "";
};

const editTask = (id) => {
  router.push(`/tasks/edit/${id}`);
};

const confirmDelete = (id) => {
  deleteTaskId.value = id;
  showDeleteModal.value = true;
};

const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}`);
    emit("tarea-eliminada");
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error eliminando tarea:", error);
  }
};

const updateStatus = async (id, newStatus) => {
  try {
    await api.patch(`/tasks/${id}`, { status: newStatus });
    emit("tarea-actualizada");
  } catch (error) {
    console.error("Error actualizando estado:", error);
  }
};
</script>

<style scoped>
.tasks-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tasks-title {
  color: #2c3e50;
  margin: 0;
}

.tasks-actions {
  display: flex;
  gap: 0.8rem;
}

.filter-btn,
.add-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.filter-btn {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #333;
}

.filter-btn:hover {
  background-color: #e0e0e0;
}

.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.add-btn:hover {
  background-color: #2980b9;
}

.filters-panel {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.reset-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  margin-left: auto;
}

.reset-btn:hover {
  text-decoration: underline;
}

.task-list {
  display: grid;
  gap: 1rem;
}

.task-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #3498db;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-urgent {
  border-left-color: #e74c3c;
}

.task-completed {
  opacity: 0.8;
  background-color: #f8f9fa;
}

.task-main {
  flex: 1;
}

.task-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.8rem;
}

.task-title {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.task-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-in-progress {
  background-color: #cce5ff;
  color: #004085;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.task-description {
  margin: 0.5rem 0;
  color: #555;
  line-height: 1.5;
}

.task-dates {
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: #666;
}

.task-dates span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
}

.task-actions button {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.edit-btn {
  color: #3498db;
}

.edit-btn:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

.delete-btn {
  color: #e74c3c;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.complete-btn {
  color: #2ecc71;
}

.complete-btn:hover {
  background-color: rgba(46, 204, 113, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.cancel-btn,
.confirm-delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.confirm-delete-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 600px) {
  .tasks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .task-card {
    flex-direction: column;
  }

  .task-actions {
    flex-direction: row;
    margin-left: 0;
    margin-top: 1rem;
    justify-content: flex-end;
  }
}
</style>
