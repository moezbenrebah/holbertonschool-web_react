import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { verificationTokens, users } from '@/db/authSchema';
import { eq } from 'drizzle-orm';
import { verifyEmailToken } from '@/app/api/services/tokenService';

export async function POST(request: NextRequest) {
    try {
        // Récupérer le token dans le corps de la requête
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
        }

        // Vérifier le token pour extraire l'email
        let payload;
        try {
            payload = verifyEmailToken(token);
        } catch (error) {
            return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
        }

        const email = payload.email;

        // Vérifier que le token de vérification existe en base de données
        const verification = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.identifier, email)
        });
        if (!verification) {
            return NextResponse.json({ error: "Aucune vérification enregistrée pour cet email." }, { status: 404 });
        }

        // Mettre à jour la table users pour marquer l'email comme vérifié
        await db.update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.email, email));

        // Supprimer le token de vérification utilisé
        await db.delete(verificationTokens)
            .where(eq(verificationTokens.identifier, email));

        return NextResponse.json({ verified: true });
    } catch (error) {
        console.error('Erreur lors de la vérification d\'email:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
