import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { usersInfo } from "@/db/appSchema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userProfile = await db.query.usersInfo.findFirst({
      where: eq(usersInfo.users_id, params.userId),
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
