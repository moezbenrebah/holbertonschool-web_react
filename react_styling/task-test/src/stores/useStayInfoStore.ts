import { create } from 'zustand'
import { stayInfo } from '@/db/appSchema'

interface StayInfoStore {
  stayInfo: typeof stayInfo.$inferSelect[];
  addStayInfo: (logementId: number, data: any) => Promise<void>;
  updateStayInfo: (cardId: number, data: any) => Promise<void>;
  deleteStayInfo: (cardId: number) => Promise<void>;
  setStayInfo: (info: typeof stayInfo.$inferSelect[]) => void;
  resetStayInfo: () => void;
}

export const useStayInfoStore = create<StayInfoStore>((set) => ({
  stayInfo: [],

  addStayInfo: async (logementId, data) => {
    try {
      const response = await fetch('/api/stay-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, accommodation_id: logementId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la carte');
      }

      const newCard = await response.json();
      set((state) => ({
        stayInfo: [...state.stayInfo, newCard]
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la carte:', error);
      throw error;
    }
  },

  updateStayInfo: async (cardId, data) => {
    try {
      const response = await fetch(`/api/stay-info/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la carte');
      }

      const updatedCard = await response.json();
      set((state) => ({
        stayInfo: state.stayInfo.map(card =>
          card.stay_info_id === cardId ? updatedCard : card
        )
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la carte:', error);
      throw error;
    }
  },

  deleteStayInfo: async (cardId) => {
    try {
      const response = await fetch(`/api/stay-info/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la carte');
      }

      set((state) => ({
        stayInfo: state.stayInfo.filter(card => card.stay_info_id !== cardId)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      throw error;
    }
  },

  setStayInfo: (info) => set({ stayInfo: info }),

  resetStayInfo: () => set({ stayInfo: [] }),
}))
