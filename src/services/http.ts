import axios from 'axios'

const http = axios.create({
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
})

http.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error.message)
    return Promise.reject(error)
  }
)

export default http