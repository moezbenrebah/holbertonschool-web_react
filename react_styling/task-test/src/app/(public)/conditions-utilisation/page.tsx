'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ConditionsUtilisation() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conditions d'utilisation</h1>
          <Button
            onClick={() => window.close()}
            className="bg-amber-600 hover:bg-amber-500"
          >
            Fermer
          </Button>
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant notre plateforme, vous acceptez d'être lié par les présentes conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
            <p>
              Notre plateforme permet aux propriétaires de gérer leurs hébergements et aux utilisateurs de réserver des séjours.
              Nous nous réservons le droit de modifier ou d'interrompre le service à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Compte utilisateur</h2>
            <p>
              Vous êtes responsable de maintenir la confidentialité de vos informations de connexion.
              Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p>
              Tout le contenu présent sur notre plateforme est protégé par les droits de propriété intellectuelle.
              Vous ne pouvez pas copier, modifier ou distribuer ce contenu sans notre autorisation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Limitation de responsabilité</h2>
            <p>
              Nous ne sommes pas responsables des dommages directs ou indirects résultant de l'utilisation de notre service.
              Nous nous efforçons de maintenir le service disponible 24/7, mais ne pouvons garantir une disponibilité continue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Modification des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les modifications prendront effet dès leur publication sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse suivante :
              support@eazost.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
