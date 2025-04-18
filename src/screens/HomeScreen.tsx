import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AppStackParamList } from '../utils/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import ImpactBreakdown from '../components/ImpactBreakdown';
import DateRangeCard from '../components/DateRangeCard';
import CarbonSummaryCard from '../components/CarbonSummaryCard';
import { useRequireAuth } from '../hooks/useRequireAuth';

type NavigationProp = StackNavigationProp<AppStackParamList>;

type HomeScreenRouteProp = RouteProp<AppStackParamList, 'Accueil'>;

const HomeScreen = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { isLoggedIn } = useRequireAuth();

  if (!isLoggedIn) return null; // ou un <Loading /> plus tard

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', padding: 16 }}>
        <DateRangeCard year={2024} range="Janvier à Déc" />
        <CarbonSummaryCard totalTons={3} flights={2} kilometers={9000} />
      </View>

      <ImpactBreakdown />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default HomeScreen;
