import { fail } from '@sveltejs/kit';
import { z } from "zod";
import { getUsers } from "$lib/api/user"
import { getTeams } from "$lib/api/team.js"
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getTeamsWhiteUsers,getTeamUnassignedUsers } from "$lib/api/teamUsers.js";
import { authUserStore,Role } from "$lib/stores/authUserStore"


const roles = ['admin', 'manager', 'team_manager', 'agent'] as const;

const schema = z.object({
    firstName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    lastName: z.string()
        .min(1, 'Champ obligatoire')
        .min(2,("Le nom doit contenir au moins 2 caractères"))
        .max(100,("Le nom ne peut pas dépasser 100 caractères")),
    email: z.string()
        .min(1, 'Champ obligatoire')
        .email("Email invalide"),
    phone: z.string().min(1, 'Champ obligatoire'),
    role: z.enum(roles),
    team: z.string().min(1, 'Champ obligatoire'),
});

  
if(!authUserStore.hasAnyRole(Role.ADMIN, Role.MANAGER, Role.TEAM_MANAGER)){
    throw redirect(302, '/403');
}


export const actions = {

    add: async ({ request, cookies }) => {

        const formData = Object.fromEntries(await request.formData());
        const result = schema.safeParse(formData);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            return fail(400, { errors,formData});
        }

        console.log("send");
        return { success: true };
  }

}

export async function load({cookies}) {
    try {
        const token: string = cookies.get('auth_token') as string;
        if (!token) throw error(401, 'Non autorisé');

        const [
            apiUsersResponse,
            apiTeamsResponse, 
            apiTeamsWhiteUsersResponse, 
            apiTeamUnassignedUsersResponse
        ] = 
            await Promise.all([
                getUsers(token),
                getTeams(token),
                getTeamsWhiteUsers(token),
                getTeamUnassignedUsers(token)
            ]);

        if (!apiUsersResponse.ok) throw error(apiUsersResponse.status, await apiUsersResponse.text());
        if (!apiTeamsResponse.ok) throw error(apiTeamsResponse.status, await apiTeamsResponse.text());
        if (!apiTeamsWhiteUsersResponse.ok) throw error(apiTeamsWhiteUsersResponse.status, await apiTeamsWhiteUsersResponse.text());
        if (!apiTeamUnassignedUsersResponse.ok) throw error(apiTeamUnassignedUsersResponse.status, await apiTeamUnassignedUsersResponse.text());

        const [
            userList, 
            teamList, 
            teamWhiteUsers, 
            teamUnassignedUsers
        ] = await Promise.all([
            apiUsersResponse.json(),
            apiTeamsResponse.json(),
            apiTeamsWhiteUsersResponse.json(),
            apiTeamUnassignedUsersResponse.json()
        ]);

        return { userList, teamList, teamWhiteUsers, teamUnassignedUsers };
    } catch (err) {
        throw error(500, 'Erreur lors du chargement des données');
    }
}
