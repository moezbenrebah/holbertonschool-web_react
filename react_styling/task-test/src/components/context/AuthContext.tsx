// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  loginUser, 
  registerUser, 
  getCurrentUser, 
  logoutUser 
} from '@/lib/user-utils';
import { toast } from '@/components/ui/sonner';

// Auth context type definition
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const navigate = useNavigate();
  
  // Check if user is logged in when component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const authData = await loginUser(credentials);
      
      setUser(authData.user);
      setIsLoggedIn(true);
      
      toast.success('Login successful!');
      navigate('/app');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      const authData = await registerUser(userData);
      
      setUser(authData.user);
      setIsLoggedIn(true);
      
      toast.success('Registration successful!');
      navigate('/app');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/');
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;