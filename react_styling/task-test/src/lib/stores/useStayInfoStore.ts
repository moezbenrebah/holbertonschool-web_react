import { create } from 'zustand';
import { type stayInfo } from '@/db/appSchema';

interface StayInfoStore {
	stayInfo: typeof stayInfo.$inferSelect[];
	isLoading: boolean;
	error: string | null;
	fetchStayInfos: (userId: number) => Promise<void>;
	fetchStayInfosById: (id: number) => Promise<void>;
	addStayInfo: (id: number, data: Partial<typeof stayInfo.$inferSelect>) => Promise<typeof stayInfo.$inferSelect>;
	updateStayInfo: (id: number, cardId: number, data: Partial<typeof stayInfo.$inferSelect>) => Promise<typeof stayInfo.$inferSelect>;
	deleteStayInfo: (id: number, cardId: number) => Promise<void>;
}

export const useStayInfoStore = create<StayInfoStore>((set) => ({
	stayInfo: [],
	isLoading: false,
	error: null,

	//fetch des cartes information
	fetchStayInfos: async (userId: number) => {
		console.log('🔄 Store - Chargement des données pour userId:', userId);
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/stayInfo?userId=${userId}`);

			if (!response.ok) {
				throw new Error(`Erreur HTTP: ${response.status}`);
			}

			const data = await response.json();
			console.log('📦 Store - Données reçues:', data);

			set({ stayInfo: data, isLoading: false });
		} catch (error) {
			console.error('❌ Store - Erreur:', error);
			set({
				error: 'Erreur lors du chargement',
				isLoading: false,
				stayInfo: []
			});
		}
	},

	//ajout de la carte information
	addStayInfo: async (id: number, data: Partial<typeof stayInfo.$inferSelect>) => {
		set({ isLoading: true, error: null });
		console.log('Adding stay info - Données reçues:', data);

		try {
			const requestData = {
				title: data.title?.trim(),
				description: data.description?.trim(),
				category: data.category,
				photo_url: data.photo_url || null
			};

			console.log('Adding stay info - Données à envoyer:', requestData);

			const response = await fetch(`/api/properties/stay-info/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			});

			const responseData = await response.json();
			console.log('Adding stay info - Réponse reçue:', responseData);

			if (!response.ok) {
				throw new Error(responseData?.error || 'Erreur lors de l\'ajout de la carte');
			}

			if (!responseData?.data) {
				throw new Error('Aucune donnée reçue du serveur');
			}

			const newCard = responseData.data;
			console.log('Adding stay info - Nouvelle carte:', newCard);

			set((state) => ({
				stayInfo: [...state.stayInfo, newCard],
				isLoading: false,
				error: null
			}));

			return newCard;
		} catch (error) {
			console.error('Error adding stay info:', error);
			set({
				error: error instanceof Error ? error.message : 'Failed to add stay info',
				isLoading: false
			});
			throw error;
		}
	},

	//mise à jour de la carte information
	updateStayInfo: async (id, cardId, data) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch('/api/stayInfo', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, cardId, ...data })
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || 'Erreur lors de la mise à jour');
			}

			const responseData = await response.json();
			set(state => ({
				stayInfo: state.stayInfo.map(info =>
					info.stay_info_id === id ? { ...info, ...responseData } : info
				),
				isLoading: false,
				error: null
			}));

			return responseData;
		} catch (error) {
			console.error('Erreur mise à jour:', error);
			set({
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				isLoading: false
			});
			throw error;
		}
	},

	// suppression de la carte information
	deleteStayInfo: async (id, cardId) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/stayInfo?id=${id}&cardId=${cardId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || 'Erreur lors de la suppression');
			}

			set(state => ({
				stayInfo: state.stayInfo.filter(info => info.stay_info_id !== id),
				isLoading: false,
				error: null
			}));
		} catch (error) {
			console.error('Erreur suppression:', error);
			set({
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				isLoading: false
			});
			throw error;
		}
	},

	//fetch des cartes information par logement
	fetchStayInfosById: async (id: number) => {
		set({ isLoading: true, error: null });
		console.log("🔄 Store - Début fetchStayInfosById pour id:", id);

		try {
			const response = await fetch(`/api/properties/stay-info/${id}`);
			console.log("📡 Store - Réponse reçue:", response.status, response.statusText);

			if (!response.ok) {
				throw new Error('Erreur lors du chargement des données');
			}

			const data = await response.json();
			console.log("📦 Store - Données reçues:", data);

			set({ stayInfo: data, isLoading: false });
			console.log("✅ Store - State mis à jour avec les cartes");
		} catch (error) {
			console.error("❌ Store - Erreur détaillée:", error);
			set({
				error: 'Erreur lors du chargement',
				isLoading: false,
				stayInfo: []
			});
		}
	}
}));
