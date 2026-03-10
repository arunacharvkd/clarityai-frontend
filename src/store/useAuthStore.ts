import { create } from 'zustand';
import type { User, Team } from '../types/auth';

interface AuthState {
  user: User | null;
  team: Team | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setTeam: (team: Team | null) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  team: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setTeam: (team) => set({ team }),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('team');
    set({ user: null, team: null, isAuthenticated: false });
  },
  loadFromStorage: () => {
    const user = localStorage.getItem('user');
    const team = localStorage.getItem('team');
    if (user) {
      set({ user: JSON.parse(user), isAuthenticated: true });
    }
    if (team) {
      set({ team: JSON.parse(team) });
    }
  },
}));
