import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { accommodation, accessCodes } from '@/db/appSchema';
import { eq } from 'drizzle-orm';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_KEY ?? '';
const API_SECRET = process.env.NEXT_PUBLIC_STREAM_SECRET ?? '';

if (!API_KEY || !API_SECRET) {
  throw new Error('Les clés Stream sont requises');
}

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

// GET - Récupérer les canaux de l'utilisateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const accountType = searchParams.get('accountType');

    if (!userId) {
      return NextResponse.json({ error: 'userId est requis' }, { status: 400 });
    }

    // Récupérer les logements et codes d'accès pertinents
    let relevantAccommodations = [];

    if (accountType === 'owner') {
      // Pour les propriétaires, récupérer tous leurs logements
      relevantAccommodations = await db
        .select()
        .from(accommodation)
        .where(eq(accommodation.users_id, userId));
    } else {
      // Pour les utilisateurs, récupérer les logements où ils ont un code d'accès valide
      const userAccessCodes = await db
        .select()
        .from(accessCodes)
        .where(eq(accessCodes.users_id, userId));

      const accommodationIds = userAccessCodes.map(code => code.accommodation_id);
      if (accommodationIds.length > 0) {
        relevantAccommodations = await db
          .select()
          .from(accommodation)
          .where(eq(accommodation.accommodation_id, accommodationIds[0]));
      }
    }

    // Récupérer les canaux existants
    const channels = await serverClient.queryChannels(
      { members: { $in: [userId] } },
      { last_message_at: -1 },
      { limit: 10 }
    );

    // Créer les canaux manquants
    for (const acc of relevantAccommodations) {
      const channelId = `accommodation-${acc.accommodation_id}`;
      const existingChannel = channels.find(c => c.id === channelId);

      if (!existingChannel) {
        try {
          const channel = serverClient.channel('messaging', channelId, {
            name: acc.name,
            members: [userId],
            accommodation_id: acc.accommodation_id,
          });

          await channel.create();
          channels.push(channel);
        } catch (error) {
          console.error(`Erreur lors de la création du canal pour le logement ${acc.accommodation_id}:`, error);
        }
      }
    }

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des canaux' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un membre à un canal
export async function POST(request: Request) {
  try {
    const { userId, accommodationId } = await request.json();

    if (!userId || !accommodationId) {
      return NextResponse.json(
        { error: 'userId et accommodationId sont requis' },
        { status: 400 }
      );
    }

    const channelId = `accommodation-${accommodationId}`;
    const channel = serverClient.channel('messaging', channelId);

    // Ajouter le membre au canal
    await channel.addMembers([userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre au canal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du membre au canal' },
      { status: 500 }
    );
  }
}
