//--- Composant AccessCodeDialog ---
//--- Composant pour la gestion des codes d'accès ---//

"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import React, { useState } from "react";
import AcessCodeForm from "../forms/AcessCodeForm";
import { toast } from "sonner";


//--- Props pour le composant AccessCodeDialog ---//
type AccessCodeDialogProps = {
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
};

//--- Composant AccessCodeDialog ---//
//--- Composant pour la gestion des codes d'accès ---//
export default function AccessCodeDialog({ onSubmit, children }: AccessCodeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      // Création du code via la fonction onSubmit passée en props
      await onSubmit(formData);

      // Fetch après la création du code :
      const response = await fetch("/api/access-codes/latest");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du code");
      }
      const data = await response.json();

      // Affichage d'un toast de succès (vous pouvez afficher data.code si nécessaire)
      toast.success("Code généré avec succès !");

      // Fermer la modale après le succès
      setIsOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du code");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 fixed inset-0 backdrop-blur-sm transition-all duration-300" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl
          transition-all duration-300 ease-in-out scale-100 opacity-100
          data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
          <DialogHeader className="p-6 bg-gradient-to-r from-amber-400 to-amber-500 border-b">
            <DialogTitle className="text-2xl font-bold text-white">
              Générer un code d'accès
            </DialogTitle>
            <DialogDescription className="text-white/90 mt-2 text-md">
              Remplissez les informations pour générer un nouveau code d'accès.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {/* AcessCodeForm utilise handleSubmit ici */}
            <AcessCodeForm onSubmit={handleSubmit} closeDialog={() => setIsOpen(false)} />
          </div>
          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full
            bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-4 h-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
