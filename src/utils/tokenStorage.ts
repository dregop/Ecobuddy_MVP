import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'accessToken';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Erreur de sauvegarde du token', e);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Erreur de lecture du token', e);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Erreur de suppression du token', e);
  }
};
