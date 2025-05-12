import { z } from "zod";

export const AccessCodeSchema = z.object({
	uuid: z.string().min(1),
	code: z.string().min(8).max(8),
	contact_method: z.enum(["email", "phone"]),
	contact: z.string().min(1).max(255),
	isActive: z.boolean().default(true),
	created_at: z.date(),
	updated_at: z.date(),
	accommodation_id: z.number().int().positive(),
	access_code_id: z.number().int().positive(),
	startDateTime: z.date(),
	endDateTime: z.date(),
});

export const verifyCodeSchema = z.object({
	code: z.string().min(8).max(8),
});
