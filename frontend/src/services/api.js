import axios from 'axios'

const api = axios.create({
  baseURL: 'https://gestiontareas-252537812380.europe-west1.run.app/api',
})

// Añadir token a cada petición si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
