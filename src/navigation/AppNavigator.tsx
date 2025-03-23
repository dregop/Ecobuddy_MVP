import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionnaireScreen, ResultsScreen, DetailsScreen } from '../screens';
import { AppStackParamList } from '../utils/types'; // Importez les types définis
import { useAuth } from '../context/AuthContext';
import Menu from '../components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import { useUserAnswers } from '../context/UserAnswersContext';

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth(); // Vérifie si l'utilisateur est connecté
  const { answers } = useUserAnswers(); // Vérifie si l'utilisateur est connecté

  console.log(answers);
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
      </Stack.Navigator>
      {/* {isLoggedIn && <Menu />} */}
      <Menu />
    </NavigationContainer>

  );
};

export default AppNavigator;
