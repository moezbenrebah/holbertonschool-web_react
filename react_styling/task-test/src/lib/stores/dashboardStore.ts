import { create } from 'zustand';
import { useAccommodationStore } from './accommodationStore';
import { useOrderStore } from './useOrderStore';

// on définit les types des données du dashboard
interface Property {
  id: number;
  name: string;
  totalSales: number;
  pendingOrders: number;
  upcomingBookings: number;
  unreadMessages: number;
  activeCodes: number;
}

// on définit les types des données des notifications
interface Notification {
  id: number;
  message: string;
  type: string;
  date: Date;
}

// on définit les types des données du store
interface DashboardStore {
  properties: Property[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

// on crée le store
export const useDashboardStore = create<DashboardStore>((set) => ({
  properties: [],
  notifications: [],
  isLoading: false,
  error: null,

  // on récupère les données du dashboard
  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      // Récupérer les données depuis les autres stores
      const accommodationStore = useAccommodationStore.getState();
      const orderStore = useOrderStore.getState();

      // Charger les données si nécessaire
      await Promise.all([
        accommodationStore.fetchAccommodationInfo(),
        orderStore.fetchOrders()
      ]);

      set({ isLoading: false });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      set({
        error: 'Erreur lors du chargement des données',
        isLoading: false
      });
    }
  },
}));
