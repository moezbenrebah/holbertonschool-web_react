// types.ts
import { StayInfo } from "@/types/stayInfo";


export interface Product {
	product_id: number;
	uuid: string;
	name: string;
	description: string | null;  // nullable dans la DB
	price: number;  // decimal en DB = number en TS
	image_url: string | null;  // nullable dans la DB
	stock: number;
	shop_id: number;
	created_at: Date | null;
	updated_at: Date | null;
  }

  // Types pour les codes d'accès
  export interface AccessCode {
	access_code_id: number;
	code: string;
	startDateTime: Date;
	endDateTime: Date;
	accommodation_id: number;
	isActive: boolean;
	contact_method: string;
	contact: string;
	created_at: Date;
	updated_at: Date;
  }

// Types pour les commandes
  export type Orders = {
	order_id: number;
	uuid: string;
	users_id: number;
	customerName: string;
	customerEmail: string;
	status: string;
	payment_status: string;
	amount: number;
	products: Array<{
		productId: number;
		quantity: number;
	}>;
	created_at: Date;
	updated_at: Date;
  };


  // Types pour les logements
  export type Accommodation = {
	InfoCard: any;
	accommodation_id: number;
	uuid: string;
	users_id: number;
	type: string;
	name: string;
	address_line1: string;
	address_line2?: string;
	city: string;
	zipcode: string;
	country: string;
	description: string;
	photo_url?: string;
	created_at: Date;
	updated_at: Date;
	stayInfo: StayInfo[];
	products: Product[]; // Liste des produits liés
  	orders: Orders[]; // Liste des commandes liées
	accessCodes?: AccessCode[];
};



export type ProductStore = {
	product: Product | null;
	isLoading: boolean;
	error: string | null;
};
