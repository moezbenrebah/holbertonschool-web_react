import { z } from "zod";
import { CARDINFORMATION_TYPES } from "@/types/cardTypes";

// Schéma de validation
export const stayInfoSchema = z.object({
	accommodation_id: z.number(),
	title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
	category: z.enum(CARDINFORMATION_TYPES, {
		errorMap: () => ({ message: "Type de carte invalide" })
	}),
	description: z.string().min(10, "La description doit être plus détaillée"),
	photo_url: z.string().nullable(),
	stay_info_id: z.number().optional(),
	created_at: z.date().nullable().optional(),
	updated_at: z.date().nullable().optional()
});

export type StayInfoSchema = z.infer<typeof stayInfoSchema>;
