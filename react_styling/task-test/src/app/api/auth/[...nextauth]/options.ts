import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/db/authSchema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

//----- AUTH OPTIONS -----//
// Options pour l'authentification //
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Vérifier si l'utilisateur existe et est vérifié
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email)
        });

        if (!user || !user.password) {
          return null;
        }

        // Vérifier si l'email est vérifié
        if (!user.emailVerified) {
          throw new Error("Veuillez vérifier votre email avant de vous connecter");
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.user_name,
          account_type: user.account_type
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
};
