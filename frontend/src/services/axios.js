import axios from 'axios'

// Vite exposes env variables on import.meta.env in the browser
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API