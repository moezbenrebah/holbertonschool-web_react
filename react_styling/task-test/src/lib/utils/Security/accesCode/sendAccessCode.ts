import { generateAccessCode } from "@/lib/utils/Security/accesCode/GenerateAccessCode";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { toast } from "@/components/ui/use-toast";
dotenv.config();

// Interface pour les paramètres d'accès
interface AccessCodeParams {
	accommodationId: number;
	startDate: Date;
	endDate: Date;
	contact: string;
	contactMethod: 'email' | 'phone';
}

// Fonction pour envoyer le code d'accès par email
export async function sendAccessCode(accessCode: AccessCodeParams, redirectUrl: string) {
	try {
		const generatedCode = await generateAccessCode({ ...accessCode, isActive: true });

		// Créer le transporteur pour envoyer l'email
		const transporter = nodemailer.createTransport({
			service : 'gmail',
			auth : {
				user : process.env.EMAIL_USER,
				pass : process.env.EMAIL_PASSWORD
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		// URL de création de compte
		const creationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/registration?code=${generatedCode}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

		// Options de l'email
		const info = await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: accessCode.contact,
			subject: 'Votre code d\'accès',
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<!-- Logo -->
					<img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="Logo Eazost" style="max-width: 200px; margin-bottom: 20px;"/>

					<!-- Titre -->
					<h2 style="color: #333; text-align: center;">Votre code d'accès pour votre séjour avec Eazost</h2>

					<!-- Corps du message -->
					<p style="color: #666; line-height: 1.5;">Bonjour,</p>
					<p style="color: #666; line-height: 1.5;">Vous partez bientôt en séjour et <strong>Eazost</strong> est heureux de vous accompagner pour rendre votre expérience encore plus agréable.</p>
					<p style="color: #666; line-height: 1.5;">Pour commencer, merci de vous rendre à l'adresse suivante afin de créer votre compte utilisateur :</p>

					<!-- Lien pour créer le compte -->
					<div style="text-align: center; margin: 30px 0;">
						<a href="${creationUrl}" style="background-color:rgb(179, 90, 0); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Créer votre compte</a>
					</div>

					<!-- Code d'accès -->
					<p style="color: #666; line-height: 1.5;">Une fois inscrit, vous pourrez accéder à de nombreuses fonctionnalités pratiques. <br><strong>Votre code d'accès est :</strong></p>
					<p style="color:rgb(179, 101, 0); font-size: 18px; font-weight: bold; text-align: center;">${generatedCode.code}</p>

					<!-- Message supplémentaire -->
					<p style="color: #666; line-height: 1.5;">Nous vous souhaitons un excellent séjour et restons à votre disposition pour toute question.</p>

					<hr style="border: 1px solid #eee; margin: 30px 0;"/>

					<!-- Pied de page -->
					<p style="color: #999; font-size: 12px; text-align: center;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
				</div>
			`
		});
		console.log('Email envoyé avec succès:', info.response);

		return generatedCode;
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'email', error);
		throw error;
	}
}
