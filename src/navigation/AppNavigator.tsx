import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionnaireScreen, ResultsScreen } from '../screens';
import { AppStackParamList } from '../utils/types'; // Importez les types définis

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Stack.Screen name="Résultats" component={ResultsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
