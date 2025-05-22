// src/lib/user-utils.ts
import api from './api-client';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  receiveNotifications?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  receiveNotifications?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API functions
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${api.getBaseUrl()}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user_id', data.user.id);
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${api.getBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user_id', data.user.id);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${api.getBaseUrl()}/api/auth/user`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    
    const userData = await response.json();
    return {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      receiveNotifications: userData.receiveNotifications
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user_id');
};