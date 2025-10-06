// App.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import Background from './components/Background';
import Banner from './components/Banner';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { useUserDataStore } from './store/userDataStore';
import { darkNavTheme, lightNavTheme, ThemeContext } from './context/ThemeContext';

const App: React.FC = () => {
  const { totalImpact } = useUserDataStore(); // kg CO₂e
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  /* Bascule auto */
  useEffect(() => {
    if (totalImpact != null) {
      setThemeName(totalImpact > 8000 ? 'dark' : 'light');
    }
  }, [totalImpact]);

  const navTheme = themeName === 'dark' ? darkNavTheme : lightNavTheme;

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, navTheme }}>
      <View style={styles.container}>
        <Background theme={themeName} />
        <AuthProvider>
          <Banner theme={themeName} />
          <AppNavigator />
        </AuthProvider>
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });
export default App;
