import axios from 'axios';

// Create an axios instance that always points to our server
// and automatically attaches the user's login token to every request
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Before every request, grab the token from localStorage and attach it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
