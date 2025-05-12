import { sendAccessCode } from "@/utils/Security/accesCode/sendAccessCode";
import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { accessCode as accessCodeTable } from "@/db/appSchema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { accessCode, redirectUrl } = body;

        if (!accessCode || !accessCode.accommodationId || !accessCode.contact) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        // Vérifier si le code existe déjà pour ce logement
        const existingCode = await db
            .select()
            .from(accessCodeTable)
            .where(eq(accessCodeTable.accommodation_id, accessCode.accommodationId))
            .limit(1);

        if (existingCode && existingCode.length > 0) {
            return NextResponse.json({ error: 'Un code d\'accès existe déjà pour ce logement' }, { status: 409 });
        }

        // Générer un nouveau code
        const newCode = {
            uuid: crypto.randomUUID(),
            accommodation_id: accessCode.accommodationId,
            code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            created_date: new Date(),
            expiration_date: new Date(accessCode.endDate),
            contact_method: accessCode.contactMethod,
            contact: accessCode.contact,
            isActive: true
        };

        // Insérer le nouveau code
        const result = await db.insert(accessCodeTable).values(newCode);

        // Envoyer le code par email
        await sendAccessCode(newCode.code, redirectUrl);

        return NextResponse.json({
            success: true,
            code: newCode.code,
            access_code_id: Number(result[0].insertId)
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du code d\'accès:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'envoi du code d\'accès' }, { status: 500 });
    }
}

//----- DELETE -----//
// Route pour supprimer un code d'accès //
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const id = parseInt(params.id);

        // Vérifier si le code appartient à un logement de l'utilisateur
        const code = await db
            .select()
            .from(accessCodeTable)
            .where(eq(accessCodeTable.access_code_id, id))
            .limit(1);

        if (!code || code.length === 0) {
            return NextResponse.json({ error: 'Code d\'accès non trouvé' }, { status: 404 });
        }

        await db.delete(accessCodeTable)
            .where(eq(accessCodeTable.access_code_id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression du code:', error);
        return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 });
    }
}
