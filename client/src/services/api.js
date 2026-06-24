// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   timeout: 15000,
// });

// // Interceptor to inject token on outgoing requests
// API.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem('aktu_user'));
//     if (user && user.token) {
//       config.headers.Authorization = `Bearer ${user.token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Interceptor to handle session timeouts (401 errors)
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn('Unauthorized session. Logging out user.');
//       localStorage.removeItem('aktu_user');
//       // Force page reload to trigger login redirect
//       if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('aktu_user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aktu_user');

      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// PYQ SERVICE
// =======================

export const pyqService = {
  getPYQs: (params) => API.get('/pyqs', { params }),

  uploadPYQ: (formData) =>
    API.post('/pyqs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deletePYQ: (id) => API.delete(`/pyqs/${id}`),

  recordDownload: (id) => API.post(`/pyqs/${id}/download`),
};

export default API;