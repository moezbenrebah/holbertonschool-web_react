const API_URL :string = import.meta.env.VITE_API_URL;

export async function getTeamsWhiteUsers(token: string): Promise<Response> {
    const response = await fetch(`${API_URL}/team/users`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}

export async function getTeamUnassignedUsers(token: string): Promise<Response> {
    const response = await fetch(`${API_URL}/team/unassigned-users`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}