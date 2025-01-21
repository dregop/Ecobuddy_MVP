import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserAnswersProvider } from './context/UserAnswersContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <UserAnswersProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserAnswersProvider>
  );
};

export default App;
