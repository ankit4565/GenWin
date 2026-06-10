import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('genwin_access_token') ||
      sessionStorage.getItem('genwin_access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default API