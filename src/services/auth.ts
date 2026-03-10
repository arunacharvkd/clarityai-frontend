import axios from 'axios';
import type { AuthResponse, User, Team, TeamMember, GoogleAuthCredential } from '../types/auth';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('team');
      window.location.href = '/login';
    }
    const message = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  signupWithGoogle: async (credential: GoogleAuthCredential): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/google/signup', credential);
    return data;
  },
  loginWithGoogle: async (credential: GoogleAuthCredential): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/google/login', credential);
    return data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};

export const teamApi = {
  create: async (name: string, description?: string): Promise<Team> => {
    const { data } = await api.post('/teams', { name, description });
    return data.data;
  },
  getById: async (id: string): Promise<Team> => {
    const { data } = await api.get(`/teams/${id}`);
    return data.data;
  },
  update: async (id: string, updates: Partial<Team>): Promise<Team> => {
    const { data } = await api.put(`/teams/${id}`, updates);
    return data.data;
  },
  invite: async (teamId: string, email: string, role: 'member' | 'admin' = 'member'): Promise<TeamMember> => {
    const { data } = await api.post(`/teams/${teamId}/invite`, { email, role });
    return data.data;
  },
  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/members/${userId}`);
  },
  updateMemberRole: async (teamId: string, userId: string, role: 'member' | 'admin'): Promise<TeamMember> => {
    const { data } = await api.patch(`/teams/${teamId}/members/${userId}`, { role });
    return data.data;
  },
};
