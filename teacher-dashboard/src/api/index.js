import axios from 'axios';

// Create a base client for public routes (login/register)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create a base client for public routes (login/register)
const publicApiClient = axios.create({
  baseURL: API_URL
});

// Create a client for secured routes that will use the token
const securedApiClient = axios.create({
  baseURL: API_URL
});

// Interceptor to add the auth token to every secured request
securedApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Authentication Functions ---
// Note: Register still creates a 'student'. Teachers must be made in the DB.
export const register = (username, password) => {
  return publicApiClient.post('/auth/register', { username, password });
};

export const login = async (username, password) => {
  const response = await publicApiClient.post('/auth/login', { username, password });
  const { token, role } = response.data;

  if (token) {
    localStorage.setItem('authToken', token);
  }
  return { token, role };
};

export const logout = () => {
  localStorage.removeItem('authToken');
};


// --- Teacher-Specific Function ---
export const getStudentData = async () => {
  // This calls the protected backend route: /api/admin/student-data
  const response = await securedApiClient.get('/admin/student-data');
  return response.data;
};