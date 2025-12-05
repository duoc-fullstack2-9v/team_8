import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://52.54.206.132:8080/api/v1', 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
