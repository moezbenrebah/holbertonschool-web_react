//--- Composant LogementForm ---
//--- Composant pour la gestion des logements ---//

"use client";

// React et types
import { useState } from 'react';
import { z } from "zod";
import { Accommodation } from "@/types";

// Composants Next.js
import Image from "next/image";

// Composants UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Composants personnalisés
import CloudinaryFileUploader from "@/components/upload/CloudinaryFileUploder";

// Stores
import { useAccommodationStore } from "@/lib/stores/accommodationStore";



// Schéma de validation des données du formulaire
export const logementSchema = z.object({
	accommodation_id: z.number(),
	name: z.string().min(1, "Le nom est requis"),
	address_line1: z.string().min(1, "L'adresse est requise"),
	address_line2: z.string().optional(),
	city: z.string().min(1, "La ville est requise"),
	zipcode: z.string().min(1, "Le code postal est requis"),
	country: z.string().min(1, "Le pays est requis"),
	description: z.string().min(10, "La description doit faire au moins 10 caractères"),
	photo_url: z.string().url().optional(),
});

//--- Props avec types stricts ---//
interface LogementFormProps {
  logement?: Accommodation;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  onCancel: () => void;
}

//--- Composant LogementForm ---//
const LogementForm = ({ logement, onSubmit, onDelete, onCancel }: LogementFormProps) => {
  const [imageUrl, setImageUrl] = useState(logement?.photo_url || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAccommodation = useAccommodationStore(state => state.deleteAccommodation);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(e.currentTarget);

    // Ajouter l'URL de l'image au FormData
    formData.set('photo_url', imageUrl);

    await onSubmit(formData);
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  // Gestion de la suppression du logement
  const handleDelete = async () => {
    if (!logement || !onDelete) return;

    try {
      setIsDeleting(true);

      // Confirmation de suppression
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce logement ?");
      if (!confirmed) return;

      await deleteAccommodation(logement.accommodation_id);
      await onDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression du logement");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt="Logement"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        <CloudinaryFileUploader
          uploadPreset="properties_preset"
          onUploadSuccess={handleImageUpload}
        />
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Type de logement</Label>
          <Select name="type" defaultValue={logement?.type || ""}>
            <SelectTrigger className="h-11 rounded-xl bg-white shadow-sm border border-gray-200">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white shadow-sm border border-gray-200">
              <SelectItem value="Appartement">Appartement</SelectItem>
              <SelectItem value="Maison">Maison</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            name="name"
			placeholder="Villa bleu"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.name || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse1">Adresse 1</Label>
          <Input
            id="adresse1"
            name="address_line1"
			placeholder="123 Rue de la Paix"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.address_line1 || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse2">Adresse 2</Label>
          <Input
            id="adresse2"
            name="address_line2"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.address_line2 || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input
            id="ville"
            name="city"
			placeholder="Paris"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.city || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codePostal">Code Postal</Label>
          <Input
            id="codePostal"
            name="zipcode"
			placeholder="75000"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.zipcode || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pays">Pays</Label>
          <Input
            id="pays"
			placeholder="France"
            name="country"
            className="h-11 rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.country || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            className="min-h-[100px] rounded-xl bg-white shadow-sm border border-gray-200"
            defaultValue={logement?.description || ""}
            required
          />
        </div>
      </div>

      {/* Boutons de soumission */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          className="flex h-11 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-900 shadow-lg transition-colors"
        >
          {logement ? "Modifier le logement" : "Ajouter le logement"}
        </Button>
      </div>
    </form>
  );
};

export default LogementForm;
