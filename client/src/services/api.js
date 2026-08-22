import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://aktu-copilot-server.onrender.com/api',
  timeout: 120000,
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
// AI PREDICTOR
// =======================

export const aiService = {
  predict: (subject_name) =>
    API.post("/ai/predict", {
      subject_name,
    }),
};
export default API;