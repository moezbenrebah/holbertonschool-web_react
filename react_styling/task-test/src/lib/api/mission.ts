const API_URL :string = import.meta.env.VITE_API_URL;

export async function getMissions(token: string): Promise<Response> {
    const response = await fetch(`${API_URL}/missions`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}