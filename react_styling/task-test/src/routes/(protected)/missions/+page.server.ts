import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { error } from '@sveltejs/kit';
import { getMissions } from "$lib/api/mission";
import { getTeams } from "$lib/api/team.js"
import { getMissionWhiteShifts } from "$lib/api/missionShifts";
import { getLocationLocationNote } from "$lib/api/locationLocationNote.js";

const locationNoteSchema = z.object({
    title: z.string()
    .min(1, "Champ obligatoire")
    .max(100, "Ne doit pas dépasser 100 caractères"),
    content: z.string()
    .min(1, "Champ obligatoire")
});

const schemaLocation = z.object({
    name: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(50,("Ne doit pas dépasser 50 caractères")),
    address: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Doit contenir au moins 2 caractères"))
        .max(100,("Ne doit pas dépasser 100 caractères")),
    team: z.string({
        required_error: "Sélectionner une équipe",
        invalid_type_error: "Type invalide"
    }).min(1, "Sélectionner une équipe"),
    notes: z.array(locationNoteSchema).optional()
});



export const actions = {

    addLocation: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());

        const result = schemaLocation.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}

export async function load({ cookies }) {
    try {
        const token = cookies.get('auth_token');
        
        // Vérification du token
        if (!token) {
            throw error(401, 'Token d\'authentification manquant');
        }

        // Lance toutes les requêtes en parallèle
        const [
            missionsRes,
            missionShiftsRes,
            locationRes,
            teamsRes
        ] = await Promise.all([
            getMissions(token),
            getMissionWhiteShifts(token),
            getLocationLocationNote(token),
            getTeams(token)
        ]);

        if (!missionsRes.ok) {
            throw error(missionsRes.status, `Erreur missions: ${await missionsRes.text()}`);
        }
        if (!missionShiftsRes.ok) {
            throw error(missionShiftsRes.status, `Erreur shifts: ${await missionShiftsRes.text()}`);
        }
        if (!locationRes.ok) {
            throw error(locationRes.status, `Erreur location: ${await locationRes.text()}`);
        }
        if (!teamsRes.ok) {
            throw error(teamsRes.status, `Erreur teams: ${await teamsRes.text()}`);
        }

        // Traite les réponses en parallèle
        const [
            missionList,
            missionShifts,
            location,
            teamList
        ] = await Promise.all([
            missionsRes.json(),
            missionShiftsRes.json(),
            locationRes.json(),
            teamsRes.json()
        ]);

        return {
            missionList,
            missionShifts,
            location,
            teamList
        };

    } catch (err) {
        // Gestion des erreurs
        if (err instanceof Error) {
            console.error('Erreur dans load:', err.message);
        }
        throw error(500, 'Échec du chargement des données');
    }
}