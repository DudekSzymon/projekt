// lib/middleware/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

// Utwórz instancję axios z konfiguracją
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 sekund timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR - dodaje token do każdego zapytania
apiClient.interceptors.request.use(
  (config) => {
    // Pobierz token z localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔑 API Request: ${config.method?.toUpperCase()} ${config.url} - Token dodany`)
    } else {
      console.log(`📨 API Request: ${config.method?.toUpperCase()} ${config.url} - Brak tokenu`)
    }
    
    // Dodaj timestamp dla debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR - obsługuje błędy i automatyczne odświeżanie tokenów
apiClient.interceptors.response.use(
  (response) => {
    // Oblicz czas zapytania
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    
    return response
  },
  (error) => {
    const { config, response } = error
    
    console.error(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url} - ${response?.status}`)
    
    // Obsługa różnych błędów
    if (response?.status === 401) {
      console.log('🔐 Token expired or invalid - clearing auth data')
      
      // Usuń nieprawidłowe dane autoryzacji
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Przekieruj na login tylko jeśli nie jesteśmy już na stronie login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true'
      }
    } else if (response?.status === 403) {
      console.log('🚫 Access forbidden')
      if (typeof window !== 'undefined') {
        alert('Brak uprawnień do wykonania tej operacji')
      }
    } else if (response?.status === 404) {
      console.log('🔍 Resource not found')
    } else if (response?.status >= 500) {
      console.log('🔥 Server error')
      if (typeof window !== 'undefined') {
        alert('Błąd serwera. Spróbuj ponownie za chwilę.')
      }
    } else if (!response) {
      console.log('🌐 Network error')
      if (typeof window !== 'undefined') {
        alert('Błąd połączenia. Sprawdź internet i spróbuj ponownie.')
      }
    }
    
    return Promise.reject(error)
  }
)

// Helper functions dla różnych typów zapytań
export const apiMiddleware = {
  // GET zapytania
  get: (url, config = {}) => {
    return apiClient.get(url, config)
  },
  
  // POST zapytania
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config)
  },
  
  // PUT zapytania
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config)
  },
  
  // DELETE zapytania
  delete: (url, config = {}) => {
    return apiClient.delete(url, config)
  },
  
  // Upload plików
  upload: (url, formData, onUploadProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },
  
  // Sprawdź czy użytkownik jest zalogowany
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },
  
  // Pobierz dane użytkownika
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Błąd parsowania danych użytkownika:', error)
      return null
    }
  },
  
  // Wyloguj użytkownika
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }
}

export default apiClient