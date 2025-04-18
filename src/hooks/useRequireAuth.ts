import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useRequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Login' as never);
    }
  }, [isLoggedIn, navigation]);

  return { isLoggedIn };
};
