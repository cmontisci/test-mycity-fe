// src/services/axios.js
import axios from 'axios';
import store from '../store/store';

const instance = axios.create({
  baseURL: 'http://localhost:80/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aggiungi un interceptor per includere il token in ogni richiesta
instance.interceptors.request.use(config => {
  const token = store.getters.getToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
