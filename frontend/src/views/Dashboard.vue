<template>
  <div style="padding: 1em; max-width: 600px; margin: auto;">
    <h2>Panel de Tareas</h2>
    <TaskForm @tarea-creada="fetchTasks" />
    <TaskList :tareas="tasks" @tarea-eliminada="fetchTasks" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import api from '../services/api'

const tasks = ref([])

const fetchTasks = async () => {
  try {
    const res = await api.get('/tasks')
    tasks.value = res.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(fetchTasks)
</script>
