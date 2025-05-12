import { db } from "@/db/db";
import { shop } from "@/db/appSchema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    console.log('🚀 API Shops - Début de la requête GET');

    const session = await getServerSession(authOptions);
    console.log('🔑 Session:', session);

    if (!session) {
      console.log('❌ API Shops - Non authentifié');
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const accommodationId = searchParams.get('accommodationId');

    console.log('🔍 API Shops - accommodationId reçu:', accommodationId);

    if (!accommodationId) {
      console.log('❌ API Shops - accommodationId manquant');
      return NextResponse.json(
        { error: "AccommodationId est requis" },
        { status: 400 }
      );
    }

    // Rechercher un shop existant
    console.log('🔍 API Shops - Recherche des shops existants...');
    const existingShops = await db
      .select()
      .from(shop)
      .where(eq(shop.accommodation_id, parseInt(accommodationId)));

    console.log('🏪 API Shops - Résultat de la recherche:', existingShops);

    // Si un shop existe, le retourner
    if (existingShops && existingShops.length > 0) {
      console.log('✅ API Shops - Shop existant trouvé:', existingShops[0]);
      return NextResponse.json(existingShops[0]);
    }

    // Si aucun shop n'existe, en créer un nouveau
    console.log('🆕 API Shops - Création d\'un nouveau shop...');
    try {
      const result = await db.insert(shop).values({
        accommodation_id: parseInt(accommodationId),
        name: `Boutique ${accommodationId}`,
        uuid: crypto.randomUUID()
      }).execute();

      // Récupérer le shop créé
      const newShop = await db
        .select()
        .from(shop)
        .where(eq(shop.accommodation_id, parseInt(accommodationId)))
        .limit(1);

      console.log('✅ API Shops - Nouveau shop créé avec succès:', newShop[0]);
      return NextResponse.json(newShop[0]);
    } catch (error) {
      console.error('❌ API Shops - Erreur lors de la création du shop:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ API Shops - Erreur générale:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des shops" },
      { status: 500 }
    );
  }
}
