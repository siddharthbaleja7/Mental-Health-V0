import axios from 'axios';

const publicApiClient = axios.create({
  baseURL: 'http://localhost:5001/api'
});

const securedApiClient = axios.create({
  baseURL: 'http://localhost:5001/api'
});

securedApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export const register = (username, password) => {
  return publicApiClient.post('/auth/register', { username, password });
};

export const login = async (username, password) => {
  const response = await publicApiClient.post('/auth/login', { username, password });
  const { token, role } = response.data;
  if (token) localStorage.setItem('authToken', token);
  return { token, role };
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const analyzeSpeech = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile, 'recording.webm');
  const response = await securedApiClient.post('/speech/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await securedApiClient.get('/speech/history');
  return response.data;
};
