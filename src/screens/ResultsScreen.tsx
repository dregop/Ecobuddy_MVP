import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserAnswers } from '../context/UserAnswersContext';

// Typage pour les props de l'écran Résultats
type ResultsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Résultats'>;
type ResultsScreenRouteProp = RouteProp<AppStackParamList, 'Résultats'>;

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { resetAnswers } = useUserAnswers();

  // Récupération de totalImpact avec typage sécurisé
  const { totalImpact } = route.params;

  const restartQuiz = () => {
    resetAnswers();
    navigation.navigate('Questionnaire'); // Retour au questionnaire
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>
        Votre empreinte carbone estimée est de {totalImpact.toFixed(2)} kg de CO2.
      </Text>
      <Button title="Relancer le test" onPress={restartQuiz} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4' },
  resultText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
});

export default ResultsScreen;
