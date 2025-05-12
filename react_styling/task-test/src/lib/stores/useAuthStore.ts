import { create } from 'zustand';

interface User {
  users_id: string;
  email: string;
  name?: string;
  user_name: string;
  account_type: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => {
    console.log('👤 AuthStore - Définition de l\'utilisateur:', user);
    set({ user });
  },
  clearUser: () => {
    console.log('🗑️ AuthStore - Suppression de l\'utilisateur');
    set({ user: null });
  },
}));
