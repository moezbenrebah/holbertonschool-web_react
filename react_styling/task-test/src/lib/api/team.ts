const API_URL :string = import.meta.env.VITE_API_URL;

export async function getTeams(token: string): Promise<Response> {
    const response = await fetch(`${API_URL}/teams`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}