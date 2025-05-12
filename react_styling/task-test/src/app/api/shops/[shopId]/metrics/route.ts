import { db } from "@/db/db";
import { product, order } from "@/db/appSchema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // Récupérer le revenu total
    const totalRevenue = await db
      .select({ total: sql<number>`COALESCE(SUM(${order.amount}), 0)` })
      .from(order)
      .where(eq(order.shop_id, shopId));

    // Récupérer le nombre total de commandes
    const totalOrders = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(order)
      .where(eq(order.shop_id, shopId));

    // Calculer le panier moyen
    const averageOrderValue = totalOrders[0].count > 0
      ? totalRevenue[0].total / totalOrders[0].count
      : 0;

    // Récupérer le meilleur vendeur
    const bestSeller = await db
      .select({
        name: product.name,
        sales: sql<number>`COUNT(*)`
      })
      .from(product)
      .leftJoin(order, eq(product.product_id, order.product_id))
      .where(eq(product.shop_id, shopId))
      .groupBy(product.product_id)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(1);

    // Récupérer le nombre de produits en stock faible
    const lowStock = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(product)
      .where(eq(product.shop_id, shopId))
      .where(sql`${product.stock} < 5`);

    return NextResponse.json({
      totalRevenue: totalRevenue[0].total,
      averageOrderValue,
      bestSeller: bestSeller[0]?.name || '',
      bestSellerSales: bestSeller[0]?.sales || 0,
      lowStock: lowStock[0].count
    });
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des métriques" },
      { status: 500 }
    );
  }
}
