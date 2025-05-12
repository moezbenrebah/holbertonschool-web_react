import { create } from 'zustand';
import { AccessCode } from '@/types';

interface AccessCodeStore {
  accessCodes: AccessCode[];
  isLoading: boolean;
  error: string | null;
  fetchAccessCodes: (accommodationId: number) => Promise<void>;
  addAccessCode: (accessCode: AccessCode) => Promise<void>;
  deleteAccessCode: (accessCode: AccessCode) => Promise<void>;
}

export const useAccessCodeStore = create<AccessCodeStore>((set) => ({
  accessCodes: [],
  isLoading: false,
  error: null,
  fetchAccessCodes: async (accommodationId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/access-codes?accommodationId=${accommodationId}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      set({
        accessCodes: data.accessCodes || [],
        isLoading: false,
        error: null
      });

    } catch (error) {
      set({
        accessCodes: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  },

  // ajouter un code d'accès
  addAccessCode: async (accessCode: AccessCode) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch('/api/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accessCode),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const newAccessCode = await response.json();
      set((state) => ({
        accessCodes: [...state.accessCodes, newAccessCode],
        isLoading: false,
        error: null
      }));

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  },

  // supprimer un code d'accès
  deleteAccessCode: async (accessCode: AccessCode) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/access-codes/${accessCode.access_code_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      set((state) => ({
        accessCodes: state.accessCodes.filter(code => code.access_code_id !== accessCode.access_code_id),
        isLoading: false,
        error: null
      }));

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  }
}));
