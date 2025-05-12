import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { accessCode, accommodation } from '@/db/appSchema';
import { eq, desc, and } from 'drizzle-orm';
import { errorHandler } from '@/lib/utils/api/errorHandler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

//----- route access-codes -----//
// route pour les codes d'accès //

//----- GET -----//
// Route pour récupérer les codes d'accès //
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const accessCodes = await db
      .select({
        access_code_id: accessCode.access_code_id,
        accommodation_id: accessCode.accommodation_id,
        created_date: accessCode.created_date,
        expiration_date: accessCode.expiration_date,
        isActive: accessCode.isActive,
        code: accessCode.code,
        contact: accessCode.contact,
        contact_method: accessCode.contact_method,
        accommodation_name: accommodation.name,
      })
      .from(accessCode)
      .leftJoin(
        accommodation,
        eq(accessCode.accommodation_id, accommodation.accommodation_id)
      )
      .where(
        and(
          eq(accommodation.users_id, session.user.id)
        )
      )
      .orderBy(desc(accessCode.created_date));

    return NextResponse.json({ accessCodes });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des codes",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}

//----- POST
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Vérifier si le logement appartient à l'utilisateur
    const accommodationExists = await db
      .select()
      .from(accommodation)
      .where(
        and(
          eq(accommodation.accommodation_id, data.accommodation_id),
          eq(accommodation.users_id, session.user.id)
        )
      )
      .limit(1);

    if (!accommodationExists || accommodationExists.length === 0) {
      return NextResponse.json(
        { error: "Logement non trouvé ou non autorisé" },
        { status: 403 }
      );
    }

    const validatedData = {
      uuid: crypto.randomUUID(),
      accommodation_id: data.accommodation_id,
      code: data.code,
      expiration_date: data.endDateTime,
      contact_method: data.contact_method,
      contact: data.contact,
      isActive: true
    };

    const result = await db.insert(accessCode)
      .values(validatedData);

    return NextResponse.json({ ...validatedData, access_code_id: Number(result[0].insertId) });
  } catch (error) {
    return errorHandler(error);
  }
}
