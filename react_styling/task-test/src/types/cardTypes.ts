export const CARDINFORMATION_TYPES = [
	'Electroménager',
	'Accès et Sécurité',
	'Guide d\'utilisation',
	'Arrivée et Départ',
	'Règles de la maison',
	'Découverte locale',
	'Environnement',
	'Autre'
] as const;

export type CardInformationType = typeof CARDINFORMATION_TYPES[number];

export interface InfoCardData {
	title: string;
	category: CardInformationType;
	description: string;
	accommodation_id: number;
	photo_url?: string | null;
	stayInfo_id?: number;
}

export type InfoCardFormData = {
	title: string;
	category: CardInformationType;
	description: string;
	accommodation_id: number;
	photo_url: string | null;
};
