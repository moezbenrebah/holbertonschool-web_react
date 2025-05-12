export type Accommodation = {
  accommodation_id: number;
  uuid: string;
  users_id: string;
  type: string;
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  zipcode: string;
  country: string;
  description?: string | null;
  photo_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  stayInfo?: {
    stay_info_id: number;
    title: string;
    description: string;
    category: string;
    photo_url: string | null;
  }[];
  products?: Product[];
  orders?: any[];
};

export interface InfoCard {
  stay_info_id: number;
  title: string;
  category: string;
  description: string;
  accommodation_id: number;
  photo_url?: string;
}

export interface stayInfo {
  stay_info_id: number;
  accommodation_id: number;
  users_id?: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  photo_url: string | null;
  title: string;
  category: string | null;
}

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

export interface ShopData {
  shop_id: number;
  name: string;
  products: Product[];
}

export interface AccessCode {
  uuid: string;
  code: string;
  contact_method: "email" | "phone";
  contact: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
  accommodation_id: number;
  access_code_id: number;
  startDateTime: Date;
  endDateTime: Date;
}
