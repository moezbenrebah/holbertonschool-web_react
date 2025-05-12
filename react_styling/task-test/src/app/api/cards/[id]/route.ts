import { NextResponse, NextRequest } from "next/server";
import { eq } from 'drizzle-orm';  // Drizzle ORM pour la requête conditionnelle
import {db} from '@/db/db';  // Instance de ta base de données
import { stayInfo } from '@/db/appSchema';  // Schéma de ta table dans la base de données
import { CardSchema } from '@/validation/CardSchema';  // Schéma de validation Zod
import dotenv from 'dotenv';
import { errorHandler } from '@/utils/api/errorHandler';
import { getUserFromToken } from '@/app/api/services/tokenService';

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

//----- GET USER FROM TOKEN -----//
// Permet de récupérer l'utilisateur à partir du token //

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
	  // ✅ Vérifier et récupérer l'utilisateur depuis le token
	  const userId = await getUserFromToken(req);
	  if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	  }

	  console.log("✅ Utilisateur authentifié avec ID:", userId);

	  // ✅ Vérification de l'ID
	  const cardId = Number(params.id);
	  if (isNaN(cardId)) {
		return NextResponse.json({ error: "Invalid card ID" }, { status: 400 });
	  }

	  // ✅ Recherche de la carte
	  const card = await db
		.select()
		.from(stayInfo)
		.where(eq(stayInfo.stay_info_id, cardId))
		.limit(1);

	  // ✅ Vérification si la carte existe
	  if (card.length === 0) {
		return NextResponse.json({ message: "Card not found", data: null }, { status: 404 });
	  }

	  return NextResponse.json({ message: "Card found", data: card[0] }, { status: 200 });

	} catch (error) {
	  return errorHandler(error);
	}
  }


//----- PUT -----//
// Route pour mettre à jour une carte //
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {

	// Vérifier l'authentification de l'utilisateur
	const userId = await getUserFromToken(req);
	console.log('Utilisateur authentifié avec ID:', userId);

    const cardId = parseInt(params.id);
    const body = await req.json();

    // Valider les données avec Zod
    const parsedData = CardSchema.parse(body);

    // Vérifier si la carte existe
    const existingCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);
    if (existingCard.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Mettre à jour la carte
    await db.update(stayInfo)
      .set(parsedData)
      .where(eq(stayInfo.stay_info_id, cardId));

    // Fetch the updated card
    const updatedCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);

    return NextResponse.json(updatedCard[0], { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}


//----- DELETE -----//
// Route pour supprimer une carte //
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {

	// Vérifier l'authentification de l'utilisateur
    const userId = await getUserFromToken(req);
    console.log('Utilisateur authentifié avec ID:', userId);

    const cardId = parseInt(params.id);

    // Vérifier si la carte existe
    const existingCard = await db.select().from(stayInfo).where(eq(stayInfo.stay_info_id, cardId)).limit(1);
    if (existingCard.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Supprimer la carte
    await db.delete(stayInfo).where(eq(stayInfo.stay_info_id, cardId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
