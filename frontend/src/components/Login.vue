<template>
  <form @submit.prevent="login" style="max-width: 300px; margin: 1em auto;">
    <h2>Iniciar sesión</h2>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Entrar</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  error.value = ''
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.msg || 'Error en inicio de sesión'
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
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
