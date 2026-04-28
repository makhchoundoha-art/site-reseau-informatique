const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/pages/login.html';
    }
    throw error;
  }
}

const apiService = {
  auth: {
    register: (data) => api('/auth/register', { method: 'POST', body: data }),
    login: (data) => api('/auth/login', { method: 'POST', body: data }),
    me: () => api('/auth/me')
  },
  courses: {
    getAll: () => api('/courses'),
    getById: (id) => api(`/courses/${id}`),
    submitQuiz: (id, answers) => api(`/courses/${id}/quiz`, { method: 'POST', body: { answers } })
  },
  exercises: {
    getAll: (params = '') => api(`/exercises${params}`),
    getById: (id) => api(`/exercises/${id}`),
    getDaily: () => api('/exercises/daily'),
    submitDaily: (id) => api(`/exercises/${id}/daily`, { method: 'POST' })
  },
  users: {
    getLeaderboard: () => api('/users/leaderboard'),
    getProfile: () => api('/users/profile'),
    updateProfile: (data) => api('/users/profile', { method: 'PUT', body: data })
  },
  progress: {
    getMyProgress: () => api('/progress/my'),
    completeChapter: (chapterId) => api('/progress/chapter', { method: 'POST', body: { chapterId } }),
    solveExercise: (exerciseId) => api('/progress/exercise', { method: 'POST', body: { exerciseId } })
  }
};

