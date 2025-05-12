import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/authSchema";
import bcrypt from "bcrypt";
import { z } from 'zod';
import { CredentialsSchema } from "@/validation/loginSchema";
import { signOut } from 'next-auth/react';
import FacebookProvider from "next-auth/providers/facebook";
import crypto from "crypto";

//----- AUTH CONFIGURATION -----//
// Gere l'authentification et la gestion des sessions //




// Type pour l'utilisateur
type UserSession = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
    image?: string;
}


// Type pour l'utilisateur
type User = {
    id: string;
    email: string;
    name: string;
    account_type?: string;
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: UserSession & DefaultSession["user"];
        accessToken?: string;
        refreshToken?: string;
    }
    interface User {
        account_type?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends UserSession {
        accessToken?: string;
        refreshToken?: string;
    }
}

// Options d'authentification
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email et mot de passe requis");
                    }

                    const user = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, credentials.email))
                        .limit(1)
                        .then(rows => rows[0]);

                    if (!user) {
                        throw new Error("Utilisateur non trouvé");
                    }

                    if (!user.emailVerified) {
                        throw new Error("Email non vérifié");
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        throw new Error("Mot de passe incorrect");
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email ?? '',
                        name: user.name ?? user.email ?? '',
                        account_type: user.account_type ?? 'user'
                    };
                } catch (error) {
                    console.error('Erreur d\'authentification:', error);
                    throw error;
                }
            }
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
        verifyRequest: '/verify-email-notice',
        newUser: '/registration'
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === "credentials") {
                    if (!user) {
                        throw new Error("Identifiants invalides");
                    }
                    return true;
                }

                if (account?.provider === "google" || account?.provider === "facebook") {
                    const existingUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, profile?.email || ''))
                        .limit(1)
                        .then(rows => rows[0]);

                    if (existingUser) {
                        return true;
                    }

                    await db.insert(users).values({
                        id: crypto.randomUUID(),
                        email: profile?.email || '',
                        name: profile?.name || '',
                        password: '',
                        uuid: crypto.randomUUID(),
                        user_name: profile?.name || profile?.email?.split('@')[0] || '',
                        emailVerified: new Date(),
                        account_type: 'user',
                        created_at: new Date(),
                        updated_at: new Date()
                    });

                    return true;
                }

                return false;
            } catch (error) {
                console.error('Erreur dans signIn callback:', error);
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("Une erreur est survenue lors de l'authentification");
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.account_type = user.account_type;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.account_type = token.account_type;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            return baseUrl;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 jours
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET
};


// Fonction pour vérifier les credential avec le mot de passe
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

const handleLogout = async () => {
  try {
    // D'abord appeler notre API pour nettoyer les cookies
    await fetch('/api/auth/logout', { method: 'POST' });
    // Ensuite utiliser signOut de NextAuth
    await signOut({ callbackUrl: '/login' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
