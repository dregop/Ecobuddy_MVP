import { Platform } from 'react-native';

export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.ecobuddy.com'; // ton domaine réel
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3001';
  }

  // IP locale de ton ordi pour mobile
  return 'http://192.168.1.90:3001';
};
