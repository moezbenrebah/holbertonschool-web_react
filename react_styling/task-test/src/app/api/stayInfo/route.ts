import { db } from '@/db/db';
import { NextResponse } from 'next/server';
import { stayInfo } from '@/db/appSchema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { accommodation } from '@/db/appSchema';

//----- route stayInfo -----//
// route pour les informations de séjour //

//----- GET -----//
// Route pour récupérer les infos //
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		console.log('🔍 API - Recherche des cartes pour userId:', userId);

		if (!userId) {
			return NextResponse.json({ error: 'UserId requis' }, { status: 400 });
		}

		const results = await db
			.select({
				stay_info_id: stayInfo.stay_info_id,
				title: stayInfo.title,
				description: stayInfo.description,
				category: stayInfo.category,
				photo_url: stayInfo.photo_url,
				accommodation_id: stayInfo.accommodation_id,
				created_at: stayInfo.created_at,
				updated_at: stayInfo.updated_at
			})
			.from(stayInfo)
			.innerJoin(
				accommodation,
				eq(stayInfo.accommodation_id, accommodation.accommodation_id)
			)
			.where(eq(accommodation.users_id, userId));

		console.log('📦 API - Résultats:', results);

		return NextResponse.json(results);
	} catch (error) {
		console.error('❌ API - Erreur:', error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}


//----- POST -----//
// Route pour créer une info de séjour //
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function POST(req: Request) {
	console.log('=== POST /api/stayInfo ===');

	try {
		let body;
		try {
			body = await req.json();
			console.log('Body reçu:', body);
		} catch (parseError) {
			console.error('Erreur de parsing du body:', parseError);
			return new Response(
				JSON.stringify({
					error: 'Format de données invalide',
					details: 'Le corps de la requête n\'est pas un JSON valide'
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		// Validation des données
		if (!body.accommodation_id || !body.title || !body.description || !body.category) {
			console.log('Validation échouée:', {
				accommodation_id: !body.accommodation_id,
				title: !body.title,
				description: !body.description,
				category: !body.category
			});
			return new Response(
				JSON.stringify({
					error: 'Champs requis manquants',
					details: {
						accommodation_id: !body.accommodation_id,
						title: !body.title,
						description: !body.description,
						category: !body.category
					}
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		// Tentative d'insertion
		try {
			await db.insert(stayInfo).values({
				accommodation_id: body.accommodation_id,
				title: body.title,
				category: body.category,
				description: body.description,
				photo_url: body.photo_url || null,
				created_at: new Date(),
				updated_at: new Date()
			});

			// Récupérer la dernière carte insérée pour ce logement
			const [insertedData] = await db
				.select()
				.from(stayInfo)
				.where(eq(stayInfo.accommodation_id, body.accommodation_id))
				.orderBy(stayInfo.created_at, "desc")
				.limit(1);

			console.log('Données insérées:', insertedData);

			if (!insertedData) {
				throw new Error('Aucune donnée n\'a été insérée');
			}

			return new Response(
				JSON.stringify(insertedData),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} catch (dbError) {
			console.error('Erreur base de données:', dbError);
			return new Response(
				JSON.stringify({
					error: 'Erreur lors de l\'insertion en base de données',
					details: dbError instanceof Error ? dbError.message : 'Erreur inconnue'
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
	} catch (error) {
		console.error('Erreur générale:', error);
		return new Response(
			JSON.stringify({
				error: 'Erreur serveur',
				details: error instanceof Error ? error.message : 'Erreur inconnue'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}

//----- PUT -----//
// Route pour mettre à jour une info de séjour //
export async function PUT(request: Request) {
	try {
		const { id, ...data } = await request.json();
		const result = await db.update(stayInfo)
			.set(data)
			.where(eq(stayInfo.stay_info_id, id));
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ message: 'Erreur mise à jour' }, { status: 500 });
	}
}

//----- DELETE -----//
// Route pour supprimer une info de séjour //
export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
	}

	try {
		await db.delete(stayInfo).where(eq(stayInfo.stay_info_id, parseInt(id)));
		return NextResponse.json({ message: 'Supprimé avec succès' });
	} catch (error) {
		return NextResponse.json({ message: 'Erreur suppression' }, { status: 500 });
	}
}
