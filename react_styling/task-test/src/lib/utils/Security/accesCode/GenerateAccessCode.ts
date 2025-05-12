import { db } from "@/db/db";
import { accessCode } from "@/db/appSchema";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { AccessCodeSchema } from "@/validation/accessCodeSchema";
import type { AccessCode } from "@/types";

//----- generateAccessCode -----//
// générer un code d'accès pour un logement //

// Fonction utilitaire pour générer un code sécurisé
const generateSecureCode = (length: number = 8): string => {
	// Utilise des caractères facilement lisibles
	const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclus I, O, 0, 1
	const bytes = crypto.randomBytes(length);
	const result = new Array(length);

	for (let i = 0; i < length; i++) {
		result[i] = charset[bytes[i] % charset.length];
	}

	return result.join('');
};



interface GenerateAccessCodeParams {
	accommodationId: number;
	startDate: Date;
	endDate: Date;
	contactMethod: "email" | "phone";
	contact: string;
	isActive: boolean;
}

export const generateAccessCode = async ({
	accommodationId,
	startDate,
	endDate,
	contactMethod,
	contact,
	isActive
}: GenerateAccessCodeParams): Promise<AccessCode> => {
	try {
		const uuid = uuidv4();
		const code = generateSecureCode(8);

		// S'assurer que les dates sont des objets Date valides
		const createdDate = new Date(startDate);
		const expirationDate = new Date(endDate);

		const result = await db.insert(accessCode).values({
			uuid,
			accommodation_id: accommodationId,
			code,
			created_date: createdDate,
			expiration_date: expirationDate,
			contact_method: contactMethod,
			contact: contact,
			isActive: isActive
		}).execute();

		// Validation des données avec Zod
		return AccessCodeSchema.parse({
			uuid,
			code,
			contact_method: contactMethod,
			contact,
			isActive,
			created_at: new Date(),
			updated_at: new Date(),
			accommodation_id: accommodationId,
			access_code_id: Number(result[0].insertId),
			startDateTime: createdDate,
			endDateTime: expirationDate,
		});
	} catch (error) {
		console.error('Erreur lors de la génération du code d\'accès:', error);
		throw error;
	}
};
