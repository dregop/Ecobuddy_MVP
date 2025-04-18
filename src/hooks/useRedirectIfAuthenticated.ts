// src/hooks/useRedirectIfAuthenticated.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useRedirectIfAuthenticated = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('Accueil' as never);
    }
  }, [isLoggedIn, navigation]);
};
