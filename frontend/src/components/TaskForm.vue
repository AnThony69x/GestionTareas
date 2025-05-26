<template>
  <form @submit.prevent="crearTarea" style="margin-bottom: 1em;">
    <input v-model="title" type="text" placeholder="Título" required />
    <textarea v-model="description" placeholder="Descripción"></textarea>
    <select v-model="status">
      <option value="pendiente">Pendiente</option>
      <option value="completada">Completada</option>
    </select>
    <input v-model="dueDate" type="date" required />
    <button type="submit">Crear tarea</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const emit = defineEmits(['tarea-creada'])

const title = ref('')
const description = ref('')
const status = ref('pendiente')
const dueDate = ref('')

const crearTarea = async () => {
  try {
    // Convertir status a completed (booleano)
    const completed = status.value === 'completada'
    
    await api.post('/tasks', {
      title: title.value,
      description: description.value,
      completed: completed,
      dueDate: dueDate.value
    })
    
    title.value = ''
    description.value = ''
    status.value = 'pendiente'
    dueDate.value = ''
    emit('tarea-creada')
  } catch (error) {
    console.error(error)
    alert('Error al crear la tarea: ' + (error.response?.data?.msg || 'Error desconocido'))
  }
}
</script>

<style scoped>
input, textarea, select {
  display: block;
  margin: 0.3em 0;
  width: 100%;
  padding: 0.4em;
}
button {
  margin-top: 0.5em;
  padding: 0.6em;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
