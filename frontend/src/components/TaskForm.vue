<template>
  <form @submit.prevent="handleCrearTarea" class="form-container">
    <input v-model.trim="title" type="text" placeholder="Título *" required />

    <textarea
      v-model.trim="description"
      placeholder="Descripción (opcional)"
    ></textarea>

    <select v-model="status">
      <option disabled value="">Seleccione estado</option>
      <option value="pendiente">Pendiente</option>
      <option value="en_proceso">En Proceso</option>
      <option value="completada">Completada</option>
    </select>

    <input v-model="dueDate" type="date" required />

    <button type="submit">Crear tarea</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

const emit = defineEmits(["tarea-creada"]);

const title = ref("");
const description = ref("");
const status = ref("pendiente");
const dueDate = ref("");

const limpiarCampos = () => {
  title.value = "";
  description.value = "";
  status.value = "pendiente";
  dueDate.value = "";
};

const handleCrearTarea = async () => {
  try {
    const nuevaTarea = {
      title: title.value,
      description: description.value,
      status: status.value,
      dueDate: dueDate.value,
    };

    await api.post("/tasks", nuevaTarea);
    emit("tarea-creada");
    limpiarCampos();
  } catch (error) {
    console.error(error);
    alert(
      "Error al crear la tarea: " +
        (error.response?.data?.msg || "Error desconocido")
    );
  }
};
</script>

<style scoped>
.form-container {
  margin-bottom: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
}

input,
textarea,
select {
  padding: 0.6em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
}

button {
  align-self: flex-start;
  padding: 0.6em 1.2em;
  background-color: #007bff;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
