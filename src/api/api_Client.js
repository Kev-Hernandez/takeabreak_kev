import axios from 'axios';

// 1. Lees la variable de entorno UNA SOLA VEZ aquí.
const API_URL = process.env.REACT_APP_API_URL;

// 2. Creas una instancia de Axios con la URL base de tu API.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 3. Ahora, en lugar de importar axios en otros archivos, importas 'apiClient'.
// Ejemplo: apiClient.post('/login', { email, password });

export default apiClient;