import { db } from "@/db/db";
import { product } from "@/db/appSchema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const shopId = parseInt(params.shopId);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: "ID de magasin invalide" },
        { status: 400 }
      );
    }

    const products = await db
      .select()
      .from(product)
      .where(eq(product.shop_id, shopId));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const shopId = parseInt(params.shopId);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: "ID de magasin invalide" },
        { status: 400 }
      );
    }

    const productData = await request.json();

    // Vérifier les données requises
    if (!productData.name || productData.price === undefined) {
      return NextResponse.json(
        { error: "Le nom et le prix sont requis" },
        { status: 400 }
      );
    }

    // Préparer les données du produit
    const newProductData = {
      ...productData,
      shop_id: shopId,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Ajouter le produit dans la base de données
    await db.insert(product).values(newProductData);

    // Récupérer le produit nouvellement créé
    const [newProduct] = await db
      .select()
      .from(product)
      .where(eq(product.uuid, productData.uuid));

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du produit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const shopId = parseInt(params.shopId);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: "ID de magasin invalide" },
        { status: 400 }
      );
    }

    // Récupérer l'ID du produit depuis l'URL
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: "ID du produit manquant" },
        { status: 400 }
      );
    }

    // Supprimer le produit
    await db.delete(product)
      .where(
        and(
          eq(product.uuid, productId),
          eq(product.shop_id, shopId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}
