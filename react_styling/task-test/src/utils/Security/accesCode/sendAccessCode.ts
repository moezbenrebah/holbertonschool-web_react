import { db } from "@/db/db";
import { accessCode } from "@/db/appSchema";
import { eq } from "drizzle-orm";

interface SendAccessCodeParams {
  email: string;
  propertyId: string;
}

export const sendAccessCode = async ({ email, propertyId }: SendAccessCodeParams) => {
  try {
    // Générer un code d'accès aléatoire à 6 chiffres
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Définir la date d'expiration (24 heures à partir de maintenant)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    // Supprimer les anciens codes d'accès pour cette propriété et cet email
    await db
      .delete(accessCode)
      .where(
        eq(accessCode.propertyId, propertyId)
      );

    // Insérer le nouveau code d'accès
    await db.insert(accessCode).values({
      code: generatedCode,
      email: email,
      propertyId: propertyId,
      expiresAt: expirationDate,
      isUsed: false
    });

    // Ici, vous pouvez ajouter l'envoi du code par email
    // Par exemple avec Resend, SendGrid ou un autre service d'email
    // await sendEmail({
    //   to: email,
    //   subject: "Votre code d'accès",
    //   content: `Votre code d'accès est : ${generatedCode}`
    // });

    return {
      success: true,
      message: "Code d'accès envoyé avec succès",
      code: generatedCode // En production, ne pas renvoyer le code dans la réponse
    };

  } catch (error) {
    console.error("Erreur lors de l'envoi du code d'accès:", error);
    throw new Error("Échec de l'envoi du code d'accès");
  }
};

// Fonction utilitaire pour vérifier un code d'accès
export const verifyAccessCode = async (code: string, propertyId: string) => {
  try {
    const result = await db
      .select()
      .from(accessCode)
      .where(
        eq(accessCode.code, code)
      )
      .limit(1);

    if (result.length === 0) {
      return {
        isValid: false,
        message: "Code d'accès invalide"
      };
    }

    const foundCode = result[0];

    if (foundCode.isUsed) {
      return {
        isValid: false,
        message: "Ce code a déjà été utilisé"
      };
    }

    if (new Date() > foundCode.expiresAt) {
      return {
        isValid: false,
        message: "Ce code a expiré"
      };
    }

    // Marquer le code comme utilisé
    await db
      .update(accessCode)
      .set({ isUsed: true })
      .where(eq(accessCode.id, foundCode.id));

    return {
      isValid: true,
      message: "Code valide"
    };

  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    throw new Error("Échec de la vérification du code");
  }
};
