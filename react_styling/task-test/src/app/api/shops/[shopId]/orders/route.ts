import { db } from "@/db/db";
import { order } from "@/db/appSchema";
import { eq } from "drizzle-orm";
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

    const orders = await db
      .select()
      .from(order)
      .where(eq(order.shop_id, shopId))
      .orderBy(order.created_at);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}
