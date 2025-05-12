import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { accommodation, orders, accessCode } from '@/db/appSchema';
import { eq } from 'drizzle-orm';
import { getUserFromToken } from '@/app/api/services/tokenService';

//----- DASHBOARD API -----//
// Récupère les données pour le dashboard //

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID utilisateur depuis le token
    const userId = getUserFromToken(request);

    // Récupérer les logements de l'utilisateur
    const properties = await db.query.accommodation.findMany({
      where: eq(accommodation.users_id, userId),
      with: {
        orders: true,
        accessCodes: true,
        messages: true
      }
    });

    // Formater les données pour le dashboard
    const dashboardData = properties.map(property => ({
      id: property.accommodation_id,
      name: property.name,
      totalSales: property.orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0,
      pendingOrders: property.orders?.filter(order => order.status === 'pending').length || 0,
      activeCodes: property.accessCodes?.filter(code => code.isActive).length || 0,
      unreadMessages: property.messages?.filter(msg => !msg.read).length || 0
    }));

    // Récupérer les notifications (à adapter selon votre schéma)
    const notifications = [
      { id: 1, message: "Nouvelle réservation pour Villa Sunset", type: "booking", date: new Date() },
      { id: 2, message: "Code d'accès généré pour Appartement Paris", type: "access_code", date: new Date() },
      { id: 3, message: "Nouveau message de John Doe", type: "message", date: new Date() }
    ];

    return NextResponse.json({
      properties: dashboardData,
      notifications
    });

  } catch (error) {
    console.error('Erreur dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
