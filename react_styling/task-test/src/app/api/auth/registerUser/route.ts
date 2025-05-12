import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db/db";
import { users, verificationTokens } from "@/db/authSchema";
import { usersSchema } from "@/validation/UserSchema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "@/lib/utils/Auth/sendVerificationEmail";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("1. Données reçues:", body);

        // Validation
        const validationResult = usersSchema.safeParse(body);
        console.log("2. Résultat validation:", validationResult);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, body.email))
            .limit(1);
        console.log("3. Utilisateur existant:", existingUser);

        if (existingUser[0]) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        // Hash du mot de passe
        const hashedPassword = await hash(body.password, 10);
        console.log("4. Mot de passe hashé créé");

        // Création de l'utilisateur
        const newUser = await db.insert(users).values({
            id: randomUUID(),
            email: body.email,
            name: body.user_name,
            password: hashedPassword,
            uuid: randomUUID(),
            user_name: body.user_name,
            account_type: body.account_type,
            stripe_customer_id: null,
            emailVerified: null,
            image: null
        });
        console.log("5. Nouvel utilisateur créé:", newUser);

        // Génération du token de vérification
        const verificationToken = jwt.sign(
            { email: body.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

		// Insérer le token dans la table des vérifications
		await db.insert(verificationTokens).values({
			identifier: body.email, // On utilise l'email comme identifiant
			token: verificationToken,
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expiration dans 24h
		  });
		  console.log("6. Enregistrement du token de vérification créé");


        // Envoi de l'email de vérification
        await sendVerificationEmail(body.email, verificationToken);
        console.log("6. Email de vérification envoyé");

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erreur détaillée:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error },
            { status: 500 }
        );
    }
}
