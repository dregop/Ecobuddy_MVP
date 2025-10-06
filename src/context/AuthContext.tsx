import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserDataStore } from '../store/userDataStore';
import { getToken } from '../utils/tokenStorage';
import { getApiUrl } from '../utils/getApiUrl';

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: { email: string; pseudo?: string } | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; pseudo: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { setUserInfo } = useUserDataStore.getState();

  const refreshUser = async () => {
    setIsAuthLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        console.warn('[AuthContext] Aucun token trouvé en local.');
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch(`${getApiUrl()}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[AuthContext] Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserInfo(data.user);
        setIsLoggedIn(true);
      } else {
        const text = await response.text();
        console.error('Réponse /me échouée :', response.status, text);
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('[AuthContext] Erreur de connexion :', err);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, refreshUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
