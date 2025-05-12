const API_URL :string = import.meta.env.VITE_API_URL;

export async function verifyToken(token: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/auth`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.ok;
}

export async function getAuthToken(email: string, password: string): Promise<Response> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
}