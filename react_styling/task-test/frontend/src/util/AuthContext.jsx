// Import necessary hooks and jwt decoding utility
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create a shared place for authentication info
const AuthContext = createContext();

// Wraps the app to give access to login data
export const AuthProvider = ({ children }) => {

  // hold user and token info
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Wait to show UI until auth is verified

// Logout function clears stored auth data
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Save login info in state and localStorage
  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

// When the component loads, get auth data from localStorage
  useEffect(() => {
    let isMounted = true; //updates on unmounted component

    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // If no token/user found, stop loading
        if (!storedToken || !storedUser) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // Decode token and check if expired
        const decoded = jwtDecode(storedToken); 
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired - auto logout");
          logout();
          return;
        }

        // If the data is good, restore the login info
        if (isMounted) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) logout(); // Clear out bad login data
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function to avoid setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [logout]); // Only logout as dependency

  // Skip if still loading
  if (isLoading) {
    return null; // Or loading spinner
  }

  return (
    // Provide auth state and actions to the rest of the app
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// A hook to access login info
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};