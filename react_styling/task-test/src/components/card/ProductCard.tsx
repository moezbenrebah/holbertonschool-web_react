'use client';

// React & Next imports
import Image from "next/image";
import { useState } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

// Custom Components
import ProductDialog from "@/components/card/dialogs/ProductDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => Promise<void>;
  onDelete: (productId: number) => Promise<void>;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(product.product_id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="group relative bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.image_url || '/images/default-product.png'}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
          width={300}
          height={200}
          quality={100}
        />
        {/* Actions Overlay */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Bouton Modifier */}
          <ProductDialog
            initialProduct={{
              ...product,
              price: Number(product.price),
              uuid: product.uuid || crypto.randomUUID(),
              created_at: product.created_at || null,
              updated_at: product.updated_at || null,
              shop_id: product.shop_id || 0
            }}
            onSave={onEdit}
            mode="edit"
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-slate-200 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 text-amber-400" />
            </Button>
          </ProductDialog>

          {/* Bouton Supprimer */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                className="bg-slate-200 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 text-red-500"/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-50">
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer {product.name} ?
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h2>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
            {product.price}€
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
