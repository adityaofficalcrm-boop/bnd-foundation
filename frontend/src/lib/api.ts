import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
