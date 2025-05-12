import { create } from 'zustand';
import { orders } from '@/db/appSchema';

interface Order {
  order_id: number;
  uuid: string;
  users_id: string;
  status: string;
  payment_status: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (shopId: number) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async (shopId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/shops/${shopId}/orders`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      set({ orders: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Une erreur est survenue', isLoading: false });
    }
  },
  addOrder: async (order) => {
    console.log("addOrder", order);
  },
}));
