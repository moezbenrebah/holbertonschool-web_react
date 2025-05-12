import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { verificationTokens, users } from '@/db/authSchema';
import { eq } from 'drizzle-orm';

//----- VALIDATION EMAIL -----//
// Permet de vérifier si l'email est valide //


//----- GET -----//
// Route pour vérifier si l'email est valide //
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ verified: false });
    }

    // Vérifier si l'email est vérifié dans la table users
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    // Si l'utilisateur existe et que son email est vérifié
    if (user && user.emailVerified) {
      return NextResponse.json({ verified: true });
    }

    // Sinon, vérifier si un token de vérification existe
    const verification = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email)
    });

    return NextResponse.json({
      verified: false,
      hasVerificationToken: !!verification?.expires
    });
  } catch (error) {
    console.error('Erreur validation email:', error);
    return NextResponse.json({ verified: false });
  }
}
