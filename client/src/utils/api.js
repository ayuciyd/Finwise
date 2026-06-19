import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  try {
    const { data } = await api.get('/csrf-token');
    csrfToken = data.csrfToken;
    api.defaults.headers['CSRF-Token'] = csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token', error);
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
