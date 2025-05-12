import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { product } from "@/db/appSchema";
import { eq } from "drizzle-orm";

// Simulation d'une base de données avec des produits
const mockProducts = [
  {
    id: 1,
    name: 'Caffe Latte',
    description: 'Un délicieux café au lait fait avec notre espresso signature et du lait chaud',
    price: 3.99,
    stock: 100,
  },
  {
    id: 2,
    name: 'Croissant',
    description: 'Croissant frais et croustillant, parfait avec un café du matin',
    price: 2.50,
    stock: 50,
  },
  {
    id: 3,
    name: 'Sandwich Végétarien',
    description: 'Sandwich frais avec légumes de saison, avocat et fromage',
    price: 6.99,
    stock: 25,
  },
  {
    id: 4,
    name: 'Salade César',
    description: 'Salade fraîche avec laitue romaine, parmesan, croûtons et sauce césar',
    price: 7.50,
    stock: 15,
  },
  {
    id: 5,
    name: 'Thé Vert',
    description: 'Thé vert biologique infusé avec de l\'eau filtrée à température optimale',
    price: 2.99,
    stock: 75,
  },
];

// Simulation d'un délai réseau pour démontrer le skeleton loader
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  try {
    // Simuler un délai de réseau de 1 seconde (pour démontrer le skeleton loader)
    await delay(1000);

    const products = await db
      .select()
      .from(product)
      .where(shopId ? eq(product.shop_id, parseInt(shopId)) : undefined);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
