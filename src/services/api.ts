import axios from 'axios';
import type { Requirement, RequirementListItem, Pagination, Stats, WizardAnswers, TemplateType, Comment } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export const requirementApi = {
  generate: async (wizardAnswers: WizardAnswers, template: TemplateType): Promise<Requirement> => {
    const { data } = await api.post('/requirements/generate', { wizardAnswers, template });
    return data.data;
  },
  list: async (params?: { page?: number; limit?: number; status?: string; template?: string; search?: string; }): Promise<{ data: RequirementListItem[]; pagination: Pagination }> => {
    const { data } = await api.get('/requirements', { params });
    return data;
  },
  getById: async (id: string): Promise<Requirement> => {
    const { data } = await api.get(`/requirements/${id}`);
    return data.data;
  },
  update: async (id: string, updates: Partial<Requirement>): Promise<Requirement> => {
    const { data } = await api.put(`/requirements/${id}`, updates);
    return data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/requirements/${id}`);
  },
  addComment: async (id: string, text: string, author?: string): Promise<Comment> => {
    const { data } = await api.post(`/requirements/${id}/comments`, { text, author: author || 'You' });
    return data.data;
  },
  getVersions: async (id: string) => {
    const { data } = await api.get(`/requirements/${id}/versions`);
    return data;
  },
  getStats: async (): Promise<Stats> => {
    const { data } = await api.get('/requirements/stats');
    return data.data;
  },
  getHint: async (fieldLabel: string, userInput: string): Promise<string | null> => {
    const { data } = await api.post('/requirements/hint', { fieldLabel, userInput });
    return data.data?.hint ?? null;
  },
};

export default api;
