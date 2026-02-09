import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const expiry = localStorage.getItem('sessionExpiry');

        if (token && userData && expiry) {
          const expiryTime = new Date(expiry);
          if (expiryTime > new Date()) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
            setSessionExpiry(expiryTime);

            // Set up auto-logout timer
            const timeUntilExpiry = expiryTime.getTime() - Date.now();
            setTimeout(() => logout(), timeUntilExpiry);
          } else {
            // Session expired
            logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);

      // Simulate API call - replace with real authentication
      if (email && password) {
        const userData = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          avatar: null,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        const token = btoa(JSON.stringify({ userId: userData.id, timestamp: Date.now() }));
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('sessionExpiry', expiry.toISOString());

        setUser(userData);
        setIsAuthenticated(true);
        setSessionExpiry(expiry);

        // Set up auto-logout timer
        setTimeout(() => logout(), 24 * 60 * 60 * 1000);

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);

      // Simulate API call - replace with real registration
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        avatar: null,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      const token = btoa(JSON.stringify({ userId: userData.id, timestamp: Date.now() }));
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('sessionExpiry', expiry.toISOString());

      setUser(userData);
      setIsAuthenticated(true);
      setSessionExpiry(expiry);

      setTimeout(() => logout(), 24 * 60 * 60 * 1000);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionExpiry');

    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiry(null);

    // Clear all app data on logout
    const keysToKeep = ['theme', 'themePreferences'];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const updateProfile = useCallback((profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  }, [user]);

  const extendSession = useCallback(() => {
    if (isAuthenticated) {
      const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setSessionExpiry(newExpiry);
      localStorage.setItem('sessionExpiry', newExpiry.toISOString());

      // Reset auto-logout timer
      setTimeout(() => logout(), 24 * 60 * 60 * 1000);
    }
  }, [isAuthenticated, logout]);

  const value = {
    isAuthenticated,
    user,
    loading,
    sessionExpiry,
    login,
    register,
    logout,
    updateProfile,
    extendSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
