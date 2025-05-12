//--- Composant OrderDialog ---//
//--- Composant pour la gestion des commandes ---//

"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import React, { useState } from "react";
import type { Product } from "@/types";

type OrderDialogProps = {
  logementNom: string;
  products?: Product[];
  onSubmit: (data: any) => void;
  children: React.ReactNode;
};

export default function OrderDialog({ logementNom, products, onSubmit, children }: OrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(Object.fromEntries(formData.entries()));
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 fixed inset-0 backdrop-blur-sm transition-all duration-300" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl
          transition-all duration-300 ease-in-out scale-100 opacity-100
          data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
          <DialogHeader className="p-6 bg-gradient-to-r from-amber-400 to-amber-500 border-b">
            <DialogTitle className="text-2xl font-bold text-white">
              Commandes - {logementNom}
            </DialogTitle>
            <DialogDescription className="text-white/90 mt-2 text-md">
              Visualisez et gérez les commandes pour ce logement.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.product_id} className="flex items-center gap-2">
                      <span>{product.name}</span>
                      <input
                        name={`quantite_${product.product_id}`}
                        type="number"
                        min="0"
                        defaultValue="0"
                        className="px-2 py-1 border rounded-md w-20"
                      />
                    </div>
                  ))
                ) : (
                  <p>Aucune commande disponible.</p>
                )}
              </div>
            </form>
          </div>
          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-4 h-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
