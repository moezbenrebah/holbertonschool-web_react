import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Gère les erreurs API et envoie une réponse JSON formatée.
 */
export function errorHandler(error: unknown) {
  console.error("❌ API - Erreur:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Données invalides", errors: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Erreur serveur", error: error instanceof Error ? error.message : "Une erreur est survenue" },
    { status: 500 }
  );
}
