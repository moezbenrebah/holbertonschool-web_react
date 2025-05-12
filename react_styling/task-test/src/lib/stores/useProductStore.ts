import { create } from 'zustand';
import { product } from '@/db/appSchema';
import { shopSchema } from '@/validation/shopSchema';
import { productSchema } from '@/validation/productSchema';
import { z } from 'zod';


// on définit les types des données du shop
interface ShopData {
	shop_id: number;
	uuid: string;
	accommodation_id: number;
	name: string;
	created_at: Date;
	updated_at: Date;
	total_revenue?: number;
	total_orders?: number;
	average_order?: number;
	best_seller?: string;
	monthly_sales?: {
		jan: number;
		feb: number;
	};
	products?: typeof product.$inferSelect[];
}


// on définit les types des données des produits
interface ProductData {
	product_id: number;
	shop_id: number;
	uuid: string;
	name: string;
	created_at: Date;
	updated_at: Date;
	description: string | null;
	price: string;
	image_url: string | null;
	stock: number;
}

// on définit les types des données du store
interface shopStore {
	shop: ShopData[];
	product: ProductData[];
	isLoading: boolean;
	error: string | null;
	fetchShopInfo: (shopId: number) => Promise<void>;
	updateProduct: (id: number, updatedData: Partial<typeof product.$inferSelect>) => Promise<void>;
	addProduct: (data: typeof product.$inferSelect) => Promise<void>;
	deleteProduct: (productData: typeof product.$inferSelect) => Promise<void>;
}

// Définir le schéma avec des champs optionnels pour le développement
const ShopSchema = z.object({
	shop_id: z.number().optional(),
	name: z.string().optional(),
	uuid: z.string().optional(),
	accommodation_id: z.number().optional(),
	created_at: z.string().or(z.date()).optional(),
	updated_at: z.string().or(z.date()).optional(),
	products: z.array(z.any()).optional()
});

type Shop = z.infer<typeof ShopSchema>;

interface ProductStore {
	shopInfo: Shop | null;
	products: ProductData[];
	performanceMetrics: {
		totalRevenue: number;
		averageOrderValue: number;
		bestSeller: string;
		bestSellerSales: number;
		lowStock: number;
	};
	isLoading: boolean;
	error: string | null;
	fetchShopInfo: (accommodationId: number) => Promise<void>;
	fetchProducts: (shopId: number) => Promise<void>;
	fetchProductsByLogementId: (logementId: number) => Promise<void>;
	fetchPerformanceMetrics: (shopId: number) => Promise<void>;
}

// on crée le store
export const useProductStore = create<ProductStore>((set) => ({
	shopInfo: null,
	products: [],
	performanceMetrics: {
		totalRevenue: 0,
		averageOrderValue: 0,
		bestSeller: '',
		bestSellerSales: 0,
		lowStock: 0
	},
	isLoading: false,
	error: null,

	fetchShopInfo: async (accommodationId: number) => {
		try {
			console.log('🔄 Store - Début de fetchShopInfo pour accommodationId:', accommodationId);
			set({ isLoading: true, error: null });

			const url = `/api/shops?accommodationId=${accommodationId}`;
			console.log('🌐 Store - URL de la requête:', url);

			const response = await fetch(url);
			console.log('📡 Store - Réponse reçue:', response.status, response.statusText);

			if (response.status === 401) {
				throw new Error('Session expirée, veuillez vous reconnecter');
			}
			if (!response.ok) {
				throw new Error('Erreur lors de la récupération des données');
			}

			const data = await response.json();
			console.log('📦 Store - Données reçues:', data);

			// Si data est un tableau vide ou null, on met shopInfo à null
			if (!data || (Array.isArray(data) && data.length === 0)) {
				console.log('⚠️ Store - Aucune donnée reçue');
				set({
					shopInfo: null,
					isLoading: false
				});
				return;
			}

			// Si data est un tableau, prendre le premier shop
			const shopData = Array.isArray(data) ? data[0] : data;
			console.log('🏪 Store - Données du shop:', shopData);

			// Valider les données
			const validatedData = ShopSchema.parse(shopData);
			console.log('✅ Store - Données validées:', validatedData);

			set({
				shopInfo: validatedData,
				isLoading: false
			});
		} catch (error) {
			console.error('❌ Store - Erreur détaillée:', error);
			set({
				error: error instanceof Error ? error.message : 'Une erreur est survenue',
				isLoading: false
			});
		}
	},

	fetchProducts: async (shopId: number) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/shops/${shopId}/products`);
			if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
			const data = await response.json();
			set({ products: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Une erreur est survenue',
				isLoading: false
			});
		}
	},

	fetchProductsByLogementId: async (logementId: number) => {
		try {
			set({ isLoading: true, error: null });
			// D'abord, récupérer les informations du shop
			const shopResponse = await fetch(`/api/shops?accommodationId=${logementId}`);
			if (!shopResponse.ok) throw new Error('Erreur lors de la récupération du shop');
			const shopData = await shopResponse.json();

			if (!shopData || !shopData.shop_id) {
				throw new Error('Shop non trouvé');
			}

			// Ensuite, récupérer les produits du shop
			const productsResponse = await fetch(`/api/shops/${shopData.shop_id}/products`);
			if (!productsResponse.ok) throw new Error('Erreur lors de la récupération des produits');
			const productsData = await productsResponse.json();

			set({ products: productsData, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Une erreur est survenue',
				isLoading: false
			});
		}
	},

	fetchPerformanceMetrics: async (shopId: number) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/shops/${shopId}/metrics`);
			if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
			const data = await response.json();
			set({ performanceMetrics: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Une erreur est survenue',
				isLoading: false
			});
		}
	},

	//update produit - on met à jour un produit
	updateProduct: async (id: number, updatedData: Partial<typeof product.$inferSelect>) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/shop?id=${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData)
			});
			const data = await response.json();
			set((state) => ({
				product: state.product.map(p => p.product_id === id ? {
					...p,
					...updatedData,
					created_at: p.created_at || new Date(),
					updated_at: new Date()
				} as ProductData : p),
				isLoading: false
			}));
		} catch (error) {
			set({ error: 'Erreur lors de la mise à jour du produit', isLoading: false });
			throw error;
		}
	},

	//add produit - on ajoute un produit
	addProduct: async (logementId: number, productData: typeof product.$inferSelect) => {
		set({ isLoading: true });
		try {
			console.log("Store - Début de l'ajout du produit:", { logementId, productData });

			// D'abord, récupérer les informations du shop
			const shopResponse = await fetch(`/api/shops?accommodationId=${logementId}`);
			if (!shopResponse.ok) throw new Error('Erreur lors de la récupération du shop');
			const shopData = await shopResponse.json();

			if (!shopData || !shopData.shop_id) {
				throw new Error('Shop non trouvé');
			}

			console.log("Store - Shop trouvé:", shopData);

			// Formater les données du produit
			const productToAdd = {
				name: productData.name,
				description: productData.description,
				price: productData.price,
				image_url: productData.image_url,
				stock: productData.stock,
				shop_id: shopData.shop_id,
				uuid: productData.uuid
			};

			console.log("Store - Données du produit à envoyer:", productToAdd);

			// Envoyer le produit au serveur
			const response = await fetch(`/api/shops/${shopData.shop_id}/products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productToAdd),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
				throw new Error(errorData.message || 'Erreur lors de l\'ajout du produit');
			}

			const responseData = await response.json();
			console.log("Store - Réponse du serveur:", responseData);

			// Mettre à jour les produits dans le store
			set((state) => ({
				products: [...state.products, responseData],
				isLoading: false
			}));

			return responseData;
		} catch (error) {
			console.error('Store - Erreur détaillée:', error);
			set({ error: 'Erreur lors de l\'ajout du produit', isLoading: false });
			throw error;
		}
	},

	//del
	deleteProduct: async (productId: string, shopId: number) => {
		set({ isLoading: true });
		try {
			console.log("Store - Début de la suppression du produit:", { productId, shopId });

			const response = await fetch(`/api/shops/${shopId}/products?productId=${productId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
				throw new Error(errorData.message || 'Erreur lors de la suppression du produit');
			}

			// Mettre à jour la liste des produits dans le store
			set((state) => ({
				products: state.products.filter(p => p.uuid !== productId),
				isLoading: false
			}));
		} catch (error) {
			console.error('Store - Erreur détaillée:', error);
			set({ error: 'Erreur lors de la suppression du produit', isLoading: false });
			throw error;
		}
	}

}));
