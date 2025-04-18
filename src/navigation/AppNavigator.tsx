import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionnaireScreen, ResultsScreen, DetailsScreen } from '../screens';
import { AppStackParamList } from '../utils/types'; // Importez les types définis
import { useAuth } from '../context/AuthContext';
import Menu from '../components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import UserInfoScreen from '../screens/UserInfoScreen';
import { useUserDataStore } from '../store/userDataStore';
import NiveauScreen from '../screens/NiveauScreen';
import LoginScreen from '../screens/LoginScreen';
import CompleteRegistrationScreen from '../screens/CompleteRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthRedirectHandler from '../components/AuthRedirectHandler';

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn, isAuthLoading } = useAuth(); // Vérifie si l'utilisateur est connecté
  const pseudo = useUserDataStore((state) => state.userInfo?.pseudo);
  const linking = {
    prefixes: ['http://localhost:8081', 'eco://'], // adapte selon ton projet
    config: {
      screens: {
        Accueil: 'accueil',
        CompleteRegistration: 'complete-registration',
        Questionnaire: 'questionnaire',
        Login: 'login',
        Résultats: 'resultats',
      },
    },
  };

  if (isAuthLoading) {
    return null;
  }
  
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent', padding: 0, margin: 0 },
      }}>
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
        <Stack.Screen name="Résultats" component={ResultsScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Niveau" component={NiveauScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
      </Stack.Navigator>

      {(isLoggedIn || !!pseudo) && <Menu />}

      <AuthRedirectHandler />

    </NavigationContainer>

  );
};

export default AppNavigator;
