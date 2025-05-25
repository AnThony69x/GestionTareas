<template>
  <div>
    <h3>Mis Tareas</h3>
    <ul v-if="tareas.length">
      <li v-for="tarea in tareas" :key="tarea._id" style="margin-bottom: 1em;">
        <strong>{{ tarea.title }}</strong> — {{ tarea.status }}
        <br />
        Vence: {{ tarea.dueDate.slice(0,10) }}
        <br />
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
</script>

<style scoped>
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
