import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ResultsScreen } from '../screens';
import { AppStackParamList } from '../utils/types'; // Importez les types définis
import { useAuth } from '../context/AuthContext';
import Menu from '../components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import UserInfoScreen from '../screens/UserInfoScreen';
import { useUserDataStore } from '../store/userDataStore';
import LoginScreen from '../screens/LoginScreen';
import CompleteRegistrationScreen from '../screens/CompleteRegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthRedirectHandler from '../components/AuthRedirectHandler';
import { navigationRef } from './navigationRef';
import ChallengeScreen from '../screens/ChallengeScreen';
import { useEffect, useState } from 'react';
import DailyResultsScreen from '../screens/Results/DailyResultsScreen';
import QuestionnaireWrapper from '../screens/Questionnaire/QuestionnaireWrapper';
import { useAppTheme } from '../context/ThemeContext';
import { ActivityIndicator, View } from 'react-native';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn, isAuthLoading } = useAuth();
  const pseudo = useUserDataStore((state) => state.userInfo?.pseudo);
  const [currentRoute, setCurrentRoute] = useState<{ name?: string; params?: any }>({});
  const { navTheme } = useAppTheme();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const route = navigationRef.getCurrentRoute();
      if (route) {
        setCurrentRoute({ name: route.name, params: route.params });
      }
    });

    return unsubscribe;
  }, []);

  const linking = {
    prefixes: ['eco://'], // 'http://192.168.1.89:8081',
    config: {
      screens: {
        Accueil: 'accueil',
        CompleteRegistration: 'complete-registration',
        Questionnaire: 'questionnaire',
        Login: 'login',
        Résultats: 'resultats',
        Challenge: 'challenge',
      },
    },
  };

  // if (isAuthLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      theme={navTheme}
      onReady={() => {
        const route = navigationRef.getCurrentRoute();
        if (route) {
          setCurrentRoute({ name: route.name, params: route.params });
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent', padding: 0, margin: 0 },
        }}
      >
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireWrapper} />
        <Stack.Screen name="Résultats" component={ResultsScreen} />
        <Stack.Screen name="DailyResults" component={DailyResultsScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Challenge" component={ChallengeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>

      {(isLoggedIn || !!pseudo) && (
        <Menu currentRouteName={currentRoute.name} currentParams={currentRoute.params} />
      )}

      <AuthRedirectHandler />
    </NavigationContainer>
  );
};

export default AppNavigator;
