import { NextRequest, NextResponse } from "next/server";
import { verifyCodeSchema } from "@/validation/accessCodeSchema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { accessCode } from "@/db/appSchema";

// Vérifier le code d'accès
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ message: "Code invalide" }, { status: 400 });
  }
  const { success } = verifyCodeSchema.safeParse({ code });
  
  if (!success) {
    return NextResponse.json({ message: "Code invalide" }, { status: 400 });
  }

  // Récupérer le code d'accès depuis la base de données
  const accessCodeFromDb = await db.query.accessCode.findFirst({
    where: eq(accessCode.code, code),
  });
  if (!accessCodeFromDb) {
    return NextResponse.json({ message: "Code invalide" }, { status: 400 });
  }

  return NextResponse.json({ message: "Code vérifié avec succès" }, { status: 200 });
}
