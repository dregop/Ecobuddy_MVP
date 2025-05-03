import React, { createContext, useContext } from 'react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';

type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  navTheme: NavigationTheme; // Theme pour NavigationContainer
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
export const useAppTheme = () => useContext(ThemeContext)!;

export const lightNavTheme: NavigationTheme = {
  ...NavigationLightTheme,
  colors: { ...NavigationLightTheme.colors, primary: '#4CAF50' },
};

export const darkNavTheme: NavigationTheme = {
  ...NavigationDarkTheme,
  colors: { ...NavigationDarkTheme.colors, primary: '#8BC34A' },
};
