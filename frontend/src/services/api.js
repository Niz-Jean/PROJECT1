import axios from 'axios';

const api = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}/api` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const workers = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  createProfile: (data) => api.post('/workers/profile', data),
  updateAvailability: (status) => api.put('/workers/availability', { status })
};

export const jobs = {
  create: (data) => api.post('/jobs', data),
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  apply: (id, data) => api.post(`/jobs/${id}/apply`, data),
  accept: (jobId, workerId) => api.put(`/jobs/${jobId}/accept/${workerId}`),
  updateStatus: (id, status) => api.put(`/jobs/${id}/status`, { status })
};

export const messages = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  send: (data) => api.post('/messages', data),
  markAsRead: (id) => api.put(`/messages/${id}/read`)
};

export const reviews = {
  create: (data) => api.post('/reviews', data),
  getForWorker: (workerId) => api.get(`/reviews/worker/${workerId}`)
};

export default api;