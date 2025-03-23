import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AppStackParamList } from '../utils/types';
import { RouteProp, useRoute } from '@react-navigation/native';

const CATEGORY_AVERAGES: any = {
  transport: 3000,
  food: 2000,
  housing: 2500,
  purchases: 1500,
  travel: 1500,
};

type DetailsScreenRouteProp = RouteProp<AppStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { categoryDetails } = route.params; // Récupération des paramètres

  const categories = Object.keys(CATEGORY_AVERAGES);
  const userValues = categories.map((cat) => categoryDetails[cat]);
  const averageValues = categories.map((cat) => CATEGORY_AVERAGES[cat]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Graphique pour les données utilisateur */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Votre empreinte carbone</Text>
        <BarChart
          data={{
            labels: categories,
            datasets: [{ data: userValues }],
          }}
          width={Dimensions.get('window').width - 40} // Largeur dynamique
          height={240} // Hauteur réduite
          yAxisLabel=""
          yAxisSuffix="kg"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            barPercentage: 0.6, // Réduit la largeur des barres
            color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`, // Bleu
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={styles.chartStyle}
          verticalLabelRotation={30}
        />
      </View>

      {/* Graphique pour la moyenne française */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Moyenne française</Text>
        <BarChart
          data={{
            labels: categories,
            datasets: [{ data: averageValues }],
          }}
          width={Dimensions.get('window').width - 40} // Largeur dynamique
          height={240} // Hauteur réduite
          yAxisLabel=""
          yAxisSuffix="kg"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            barPercentage: 0.6, // Réduit la largeur des barres
            color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Rouge
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={styles.chartStyle}
          verticalLabelRotation={30}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  chartContainer: {
    marginBottom: 10, // Espacement entre les graphiques
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default DetailsScreen;
