import axios from 'axios';

// 1. Lees la variable de entorno UNA SOLA VEZ aquí.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; // Añadimos un valor por defecto

// 2. Creas una instancia de Axios con la URL base de tu API.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 3. (ESTA ES LA PARTE NUEVA) Agregamos el interceptor de peticiones.
apiClient.interceptors.request.use(
  (config) => {
    // Busca el token en el sessionStorage.
    const token = sessionStorage.getItem('token');
    
    // Si el token existe, lo añade a la cabecera 'Authorization'.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Devuelve la configuración modificada para que la petición continúe.
    return config;
  },
  (error) => {
    // Maneja errores en la configuración de la petición.
    return Promise.reject(error);
  }
);


// 4. Ahora, en lugar de importar axios en otros archivos, importas 'apiClient'.
// Ejemplo: apiClient.post('/login', { email, password });
// Ejemplo: apiClient.get('/api/web/avatars'); // -> Esta petición ya llevará el token automáticamente

export default apiClient;