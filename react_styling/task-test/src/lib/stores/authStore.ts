import { create } from 'zustand';

interface User {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  account_type: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (userData) => {
    console.log('👤 AuthStore - setUser:', userData);
    set({ user: userData, isAuthenticated: true });
  },
  clearUser: () => {
    console.log('🗑️ AuthStore - clearUser');
    set({ user: null, isAuthenticated: false });
  }
}));
