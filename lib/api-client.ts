import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
const isBrowser = typeof window !== 'undefined';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = isBrowser ? localStorage.getItem('auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      if (isBrowser) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Sesi Anda telah berakhir. Silakan login kembali.'));
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Anda tidak memiliki akses ke fitur ini.'));
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Data tidak ditemukan.'));
    }

    // Handle 500 Server Error
    if (error.response?.status && error.response.status >= 500) {
      return Promise.reject(new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.'));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'));
    }

    // Extract error message from response
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Terjadi kesalahan. Silakan coba lagi.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
