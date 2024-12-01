import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Base URL for the backend API
  withCredentials: true  // Include credentials in all requests to the backend API
});

export default api;
