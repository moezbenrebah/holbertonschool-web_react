import { getUsersById } from "$lib/api/user"
import { authUserStore } from "$lib/stores/authUserStore.js"
import { error } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {

        const token = cookies.get('auth_token');
        const userId = authUserStore.getUserId();


        if (!token) {
            throw error(401, 'Token d\'authentification manquant');
        }

        if (!userId) {
            throw error(400, 'ID utilisateur non disponible');
        }


        const userResponse = await getUsersById(token, userId);

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            throw error(userResponse.status, errorText || 'Erreur lors de la récupération du profil');
        }

        const profil = await userResponse.json();

        return {
            userId,
            profil
        };

    } catch (err) {
        console.error('Erreur dans load:', err);
        if (err instanceof Error && 'status' in err) {
            throw err;
        }
        throw error(500, 'Une erreur est survenue lors du chargement du profil');
    }
}


