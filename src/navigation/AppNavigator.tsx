import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionnaireScreen, ResultsScreen, DetailsScreen } from '../screens';
import { AppStackParamList } from '../utils/types'; // Importez les types définis
import { useAuth } from '../context/AuthContext';
import Menu from '../components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import UserInfoScreen from '../screens/UserInfoScreen';
import { useUserDataStore } from '../store/userDataStore';

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth(); // Vérifie si l'utilisateur est connecté
  const pseudo = useUserDataStore((state) => state.userInfo?.pseudo);

  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent', padding: 0, margin: 0 }, // Évite de cacher le dégradé
      }}>
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
        <Stack.Screen name="Résultats" component={ResultsScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      </Stack.Navigator>
      {(isLoggedIn || !!pseudo) && <Menu />}
    </NavigationContainer>

  );
};

export default AppNavigator;
