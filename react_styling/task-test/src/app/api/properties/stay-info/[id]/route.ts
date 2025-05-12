import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { stayInfo, accommodation } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


//----- route stay-info -----//
// route pour les informations de séjour //

//----- GET -----//
// Route pour récupérer les informations d'un logement //
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Vérifier que l'utilisateur a accès à ce logement
    const accommodationResult = await db
      .select()
      .from(accommodation)
      .where(eq(accommodation.accommodation_id, id))
      .limit(1);

    if (!accommodationResult[0]) {
      return NextResponse.json({ error: "Logement non trouvé" }, { status: 404 });
    }

    if (accommodationResult[0].users_id !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé à accéder à ce logement" }, { status: 403 });
    }

    const stayInfos = await db
      .select()
      .from(stayInfo)
      .where(eq(stayInfo.accommodation_id, id));

    return NextResponse.json(stayInfos);
  } catch (error) {
    console.error("Erreur lors de la récupération des informations de séjour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des informations de séjour" },
      { status: 500 }
    );
  }
}

//----- POST -----//
// Route pour ajouter une information de séjour //
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Vérifier que l'utilisateur a accès à ce logement
    const accommodationResult = await db
      .select()
      .from(accommodation)
      .where(eq(accommodation.accommodation_id, id))
      .limit(1);

    if (!accommodationResult[0]) {
      return NextResponse.json({ error: "Logement non trouvé" }, { status: 404 });
    }

    if (accommodationResult[0].users_id !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé à accéder à ce logement" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Données reçues:", body);

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: "Titre, description et catégorie sont requis" },
        { status: 400 }
      );
    }

    const newStayInfo = await db.insert(stayInfo).values({
      title: body.title,
      description: body.description,
      category: body.category,
      accommodation_id: id,
      photo_url: body.photo_url || null
    });

    // Récupérer la carte nouvellement créée
    const createdStayInfo = await db
      .select()
      .from(stayInfo)
      .where(eq(stayInfo.accommodation_id, id))
      .limit(1);

    if (!createdStayInfo[0]) {
      console.error("Erreur: Aucune carte trouvée après insertion");
      return NextResponse.json(
        { error: "Erreur lors de la récupération de la carte créée" },
        { status: 500 }
      );
    }

    console.log("Nouvelle carte créée:", createdStayInfo[0]);
    return NextResponse.json({ data: createdStayInfo[0] }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'information de séjour:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'information de séjour" },
      { status: 500 }
    );
  }
}
