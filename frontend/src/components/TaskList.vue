<template>
  <div>
    <h3>Mis Tareas</h3>

    <ul v-if="tareas.length" class="task-list">
      <li v-for="tarea in tareas" :key="tarea._id" class="task-item">
        <div class="task-header">
          <strong>{{ tarea.title }}</strong>
          <span :class="getStatusClass(tarea.status)">
            {{ formatStatus(tarea.status) }}
          </span>
        </div>

        <p v-if="tarea.description" class="description">
          {{ tarea.description }}
        </p>

        <div class="due-date">Vence: {{ formatDate(tarea.dueDate) }}</div>

        <button @click="eliminarTarea(tarea._id)">Eliminar</button>
      </li>
    </ul>

    <p v-else>No tienes tareas aún. ¡Crea una!</p>
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
    await api.delete(`/tasks/${id}`);
    emit("tarea-eliminada");
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};

const formatStatus = (status) => {
  const map = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completada: "Completada",
  };
  return map[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getStatusClass = (status) => {
  const classes = {
    pendiente: "status-pending",
    en_proceso: "status-in-progress",
    completada: "status-completed",
  };
  return classes[status] || "";
};
</script>

<style scoped>
.task-list {
  list-style: none;
  padding: 0;
  margin-top: 1em;
}

.task-item {
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: #555;
  font-style: italic;
  margin: 0.6em 0;
}

.due-date {
  color: #444;
  font-size: 0.9em;
  margin-bottom: 0.5em;
}

.status-pending {
  background-color: #ffc107;
  color: #212529;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-in-progress {
  background-color: #17a2b8;
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
}

.status-completed {
  background-color: #28a745;
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
}

button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #a71d2a;
}
</style>
