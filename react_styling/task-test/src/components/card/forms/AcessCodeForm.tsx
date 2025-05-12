//--- Composant AccessCodeForm ---
//--- Composant pour la gestion des codes d'accès ---//

"use client";

// React imports
import { useState, useEffect, useCallback } from "react";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Stores
import { useAccommodationStore } from "@/lib/stores/accommodationStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSession } from "next-auth/react";
import { ShadcnDatePicker } from "@/components/ui/date-picker";
import { z } from "zod";

// Utils
import { generateAccessCode } from "@/lib/utils/Security/accesCode/GenerateAccessCode";
import { sendAccessCode } from "@/lib/utils/Security/accesCode/sendAccessCode";
import { toast } from "@/components/ui/use-toast";

// Schéma de validation des données du formulaire
export const accessCodeSchema = z.object({
	accommodation_id: z.number(),
	contact_method: z.enum(["email", "phone"]),
	contact: z.string().email("L'adresse e-mail est invalide").or(z.string().regex(/^\+\d{1,3}\s\d{1,4}\s\d{1,4}\s\d{1,4}\s\d{1,4}$/, "Le numéro de téléphone est invalide")),
	start_date: z.date(),
	end_date: z.date()
});



type AccessCodeFormProps = {
  onSubmit: (data: any) => void;
  closeDialog?: () => void;
};

const AccessCodeForm = ({ onSubmit, closeDialog }: AccessCodeFormProps) => {
  const { data: session } = useSession();
  const { user } = useAuthStore();
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore();
  const [selectedAccommodation, setSelectedAccommodation] = useState<number>();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Mémorisation de fetchAccommodationInfo
  const fetchInfo = useCallback(() => {
    if (session?.user) {
      fetchAccommodationInfo(session.user.id);
    }
  }, [session?.user, fetchAccommodationInfo]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  //
  const accommodations = Array.isArray(accommodationInfo) ? accommodationInfo : [];


  // Fonction pour générer le code d'accès
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccommodation || (!email && !phone)) {
      return alert("Veuillez remplir tous les champs.");
    }
    const contact = contactMethod === "email" ? email : phone;
    onSubmit({ accommodation: selectedAccommodation, contactMethod, contact });
  };

  // Regroupez la validation et l'envoi en une seule fonction.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccommodation || (!email && !phone)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const contact = contactMethod === "email" ? email : phone;

    if (!selectedAccommodation) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un logement",
        variant: "destructive"
      });
      return;
    }

    try {
      const accessCodeData = {
        accommodationId: selectedAccommodation,
        startDate: startDate?.toISOString() || new Date().toISOString(),
        endDate: endDate?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        contact,
        contactMethod,
      };

      const response = await fetch('/api/send-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCode: accessCodeData,
          redirectUrl: window.location.origin
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du code');
      }

      toast({
        title: "Succès !",
        description: `Le code d'accès a été envoyé à ${contact}`,
        variant: "default"
      });

      // Réinitialiser le formulaire
      setEmail("");
      setPhone("");
      setStartDate(null);
      setEndDate(null);
      setSelectedAccommodation(undefined);

      // Fermer la modale
      if (closeDialog) {
        closeDialog();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi du code",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Sélection du logement */}
      <div>
        <Label className="text-sm font-bold">Logement</Label>
        <select
          value={selectedAccommodation?.toString() || ''}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setSelectedAccommodation(value);
          }}
          className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-amber-500"
        >
          <option value="" disabled>Sélectionnez un logement</option>
          {accommodations.length > 0 ? (
            accommodations.map((acc) => (
              <option
                key={acc.accommodation_id}
                value={acc.accommodation_id.toString()}
              >
                {acc.name}
              </option>
            ))
          ) : (
            <option value="no-accommodations" disabled>
              Aucun logement disponible
            </option>
          )}
        </select>

        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col justify-center">
            <label htmlFor="startDate" className="text-sm font-bold">Date de début</label>
            <ShadcnDatePicker
              startYear={2025}
              endYear={2050}
              onSelect={(date) => {
                console.log("Date de début sélectionnée:", date);
                setStartDate(date);
              }}
              value={startDate}
            />
          </div>
          <div className="flex flex-col justify-center my-2">
            <label htmlFor="endDate" className="text-sm font-bold">Date de fin</label>
            <ShadcnDatePicker
              startYear={2025}
              endYear={2050}
              onSelect={(date) => {
                console.log("Date de fin sélectionnée:", date);
                setEndDate(date);
              }}
              value={endDate}
            />
          </div>
        </div>
      </div>

	{/* Méthode de contact */}
       <Label className="text-sm font-bold">Contact</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="email"
              name="contactMethod"
              value="email"
              checked={contactMethod === "email"}
              onChange={() => setContactMethod("email")}
            />
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            type="email"
            placeholder="client@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={contactMethod !== "email"}
          />

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="phone"
              name="contactMethod"
              value="phone"
              checked={contactMethod === "phone"}
              onChange={() => setContactMethod("phone")}
            />
            <Label htmlFor="phone">Téléphone</Label>
          </div>
          <Input
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={contactMethod !== "phone"}
          />
        </div>

      <div className="flex justify-end space-x-2">
        {/* Bouton de soumission */}
        <Button type="submit" className=" bg-amber-400 text-gray-900 hover:bg-amber-500">
          Générer
      </Button>
	  </div>
    </form>
  );
};

export default AccessCodeForm;
