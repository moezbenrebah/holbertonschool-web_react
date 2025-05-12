import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { verificationTokens, users } from '@/db/authSchema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/utils/Auth/sendVerificationEmail';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
        }

        // Vérifier si l'utilisateur existe
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Générer un nouveau token
        const verificationToken = jwt.sign(
            { email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        // Supprimer l'ancien token s'il existe
        await db.delete(verificationTokens)
            .where(eq(verificationTokens.identifier, email));

        // Insérer le nouveau token
        await db.insert(verificationTokens).values({
            identifier: email,
            token: verificationToken,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        // Envoyer le nouvel email
        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json({
            success: true,
            message: 'Email de vérification renvoyé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors du renvoi de l\'email:', error);
        return NextResponse.json({
            error: 'Erreur lors du renvoi de l\'email de vérification'
        }, { status: 500 });
    }
}
