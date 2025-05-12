const API_URL :string = import.meta.env.VITE_API_URL;

export async function getUsers(token: string): Promise<Response> {
    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}

export async function getUsersById(token: string,userId: string): Promise<Response> {
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}

export async function getUserCurrentWeekShifts(token: string,userId: string): Promise<Response> {
    const response = await fetch(`${API_URL}/users/${userId}/current-week-shifts`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}

export async function getUserCurrentMonthShiftsMetric(token: string,userId: string): Promise<Response> {
    const response = await fetch(`${API_URL}/users/${userId}/metric-shift`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response;
}