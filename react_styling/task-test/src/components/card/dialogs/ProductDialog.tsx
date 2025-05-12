"use client";

//--- Composant ProductDialog ---//
//--- Composant pour la gestion des produits ---//



// React imports
import React, { useState } from "react";
// UI Components
import * as Dialog from '@radix-ui/react-dialog';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
// Custom Components
import ProductForm from "../forms/ProductForm";
// Types
import type { Product } from "@/types";



type ProductDialogProps = {
  initialProduct?: Product;
  onSave: (product: Product) => Promise<void>;
  mode: 'create' | 'edit';
  children: React.ReactNode;
};

export default function ProductDialog({
  initialProduct,
  onSave,
  mode,
  children
}: ProductDialogProps) {
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      product_id: 0,
      uuid: crypto.randomUUID(),
      name: '',
      price: 0,
      stock: 0,
      description: '',
      image_url: null,
      shop_id: 0,
      created_at: null,
      updated_at: null
    }
  );
  const [open, setOpen] = useState(false);

  const handleSave = async (product: Product): Promise<void> => {
    await onSave(product);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 fixed inset-0 backdrop-blur-sm transition-all duration-300" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          bg-white rounded-2xl shadow-2xl overflow-hidden
          w-full max-w-2xl transition-all duration-300 ease-in-out
          scale-100 opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
          <DialogHeader className="p-6 bg-gradient-to-r from-amber-400 to-amber-500 border-b">
            <DialogTitle className="text-2xl font-bold text-white">
              {mode === 'create' ? 'Ajouter un produit' : 'Modifier le produit'}
            </DialogTitle>
            <DialogDescription className="text-white/90 mt-2 text-md">
              {mode === 'create' ? 'Ajoutez un nouveau produit au shop' : 'Modifiez les informations du produit'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8">
            <ProductForm
              product={product}
              onChange={setProduct}
              onSubmit={handleSave}
              onCancel={() => setOpen(false)}
            />
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
