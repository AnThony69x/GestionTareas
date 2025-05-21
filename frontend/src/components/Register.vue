<template>
  <form @submit.prevent="register" style="max-width: 300px; margin: 1em auto;">
    <h2>Registro</h2>
    <input v-model="name" type="text" placeholder="Nombre" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Registrar</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  error.value = ''
  try {
    await api.post('/auth/register', { name: name.value, email: email.value, password: password.value })
    router.push('/login')
  } catch (e) {
    error.value = e.response?.data?.msg || 'Error en registro'
  }
}
</script>

<style scoped>
input {
  display: block;
  margin: 0.5em 0;
  width: 100%;
  padding: 0.5em;
}
button {
  width: 100%;
  padding: 0.7em;
  background-color: #28a745;
  border: none;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #1e7e34;
}
</style>
