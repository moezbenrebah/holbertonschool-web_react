"use client";

import { useEffect } from 'react';
import { useProductStore } from '@/lib/stores/useProductStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => Promise<void>;
  onDelete: (productId: number) => Promise<void>;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {product.image_url && (
          <div className="relative w-full h-48">
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-gray-600">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">{product.price}€</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
      </CardContent>
    </Card>
  );
}
