'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AideConnexion() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aide à la connexion</h1>
          <Button
            onClick={() => window.close()}
            className="bg-amber-600 hover:bg-amber-500"
          >
            Fermer
          </Button>
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Problèmes courants</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vérifiez que votre email est correctement saisi</li>
              <li>Assurez-vous que votre mot de passe est correct</li>
              <li>Vérifiez que votre compte a été activé via l'email de confirmation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Mot de passe oublié</h2>
            <p>
              Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur le lien "Mot de passe oublié" sur la page de connexion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Email non reçu</h2>
            <p>
              Si vous n'avez pas reçu l'email de confirmation, vérifiez votre dossier spam ou contactez notre support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Support technique</h2>
            <p>
              Pour toute autre question ou problème technique, n'hésitez pas à contacter notre équipe de support à l'adresse suivante :
              support@eazost.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
