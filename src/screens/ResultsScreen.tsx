import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserDataStore } from '../store/userDataStore';
import { globalQuestions } from '../data/questions';
// Typage pour les props de l'écran Résultats
type ResultsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Résultats'>;
type ResultsScreenRouteProp = RouteProp<AppStackParamList, 'Résultats'>;

const { width } = Dimensions.get('window');

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { totalImpact, categoryDetails, resetAnswers } = useUserDataStore();

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
          Pour information la moyenne pour un français est estimée à 10 tonnes de CO₂/an. 
        </Text>
        <Text style={styles.buttonContainer}>
          <Button title="Avoir plus d'informations" onPress={viewDetails} />
        </Text>
        <Text style={styles.buttonContainer}>
          Affine ton empreinte avec d'autres questions : <br></br>
          <Button title="Questions illimités" onPress={startGlobalQuiz}/>
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
