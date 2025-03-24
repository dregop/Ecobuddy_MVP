import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Background from './components/Background';
import Banner from './components/Banner';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Changez le thème ici pour tester

  return (
    <View style={styles.container}>
      {/* Fond dynamique */}
      <Background theme={theme} />

      {/* Bannière dynamique */}
      <Banner theme={theme} />

      <AuthProvider>
          <AppNavigator />
      </AuthProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
