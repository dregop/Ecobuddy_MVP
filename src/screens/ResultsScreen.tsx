import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserAnswers } from '../context/UserAnswersContext';

// Typage pour les props de l'écran Résultats
type ResultsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Résultats'>;
type ResultsScreenRouteProp = RouteProp<AppStackParamList, 'Résultats'>;

const { width } = Dimensions.get('window');

// Valeur moyenne annuelle française (en kg de CO₂)
const FRENCH_AVERAGE_TOTAL = 10000; // 10 tonnes de CO₂

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { resetAnswers } = useUserAnswers();

const globalQuestions = [
  { id: 1, question: 'Prout ?', field: 'transportMode', value: 'car', icon: require('../assets/images/car.png') },
  { id: 2, question: 'Parcourez-vous plus de 100 km par semaine ?', field: 'weeklyDistance', value: 150, icon: require('../assets/images/car.png') },
  { id: 3, question: 'Votre logement est-il de grande taille (> 90 m²) ?', field: 'homeSize', value: 100, icon: require('../assets/images/house.png') },
  { id: 4, question: 'Votre consommation d’énergie dépasse-t-elle 3000 kWh/an ?', field: 'energyConsumption', value: 3500, icon: require('../assets/images/house.png') },
  { id: 5, question: 'Consommez-vous régulièrement de la viande rouge ?', field: 'dietType', value: 'omnivore', icon: require('../assets/images/shopping.png') },
  { id: 6, question: 'Prenez-vous plus de 2 vols long-courriers par an ?', field: 'yearlyFlights', value: 4, icon: require('../assets/images/plane.png') },
  { id: 7, question: 'Ces vols sont-ils principalement longs (> 5000 km) ?', field: 'flightDistance', value: 'long', icon: require('../assets/images/plane.png') },
  { id: 8, question: 'Achetez-vous plus de 10 vétements neuf par mois ?', field: 'clothingPurchases', value: 600, icon: require('../assets/images/shopping.png') },
  { id: 9, question: 'Changer vous de téléphones tous les 2 ans plus ou moins ?', field: 'electronicsPurchases', value: 400, icon: require('../assets/images/shopping.png') },
];

  // Récupération de totalImpact avec typage sécurisé
  const { totalImpact, categoryDetails } = route.params;

  console.log(totalImpact);
  console.log(categoryDetails);

  // Calcule le pourcentage par rapport à la moyenne française
  const comparisonPercentage = ((totalImpact / FRENCH_AVERAGE_TOTAL) * 100).toFixed(1);

  const restartQuiz = () => {
    resetAnswers();
    navigation.navigate('Questionnaire', {}); // Retour au questionnaire
  };

  const startGlobalQuiz = () => {
    navigation.navigate('Questionnaire', { questions: globalQuestions }); // Retour au questionnaire
  };

  const viewDetails = () => {
    navigation.navigate('Details', { categoryDetails }); // Navigation vers l'écran Détails
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.resultText}>
          Votre empreinte carbone estimée est de {totalImpact.toFixed(2)} kg de CO₂.
        </Text>
        <Text style={styles.comparisonText}>
          Cela représente {comparisonPercentage}% de la moyenne française (10 tonnes de CO₂/an).
        </Text>
        <Text style={styles.buttonContainer}>
          <Button title="Voir les détails" onPress={viewDetails} />
        </Text>
        <Text style={styles.buttonContainer}>
          Affine ton empreinte avec d'autres questions : <br></br>
          <Button title="Lancer le test global" onPress={startGlobalQuiz}/>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'transparent', },
  resultText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  comparisonText: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', margin: 10 },
  card: {
    position: 'absolute',
    width: width * 0.9,
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)',
  },
});

export default ResultsScreen;
