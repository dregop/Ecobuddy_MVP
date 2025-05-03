import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../utils/types';
import { useUserDataStore } from '../../store/userDataStore';

const { width } = Dimensions.get('window');

type DailyResultsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'DailyResults'>;

const DailyResultsScreen = () => {
  const navigation = useNavigation<DailyResultsScreenNavigationProp>();
  const { dailyImpact, impactDelta, userInfo, answers } = useUserDataStore();

  // Suggestions pondérées par impact
  const food = answers.food || {};
  const transport = answers.transport || {};
  const purchases = answers.purchases || {};
  const housing = answers.housing || {};

  const suggestionCandidates: { condition: boolean; text: string; impact: number }[] = [
    {
      condition: purchases['dailyClothingPurchase'] === true,
      text: '👕 Évite d’acheter neuf, essaie l’occasion ou la réparation (–15 kg CO₂e).',
      impact: 15,
    },
    {
      condition: food['dailyMeatIntake'] === true,
      text: '🥦 Remplace la viande rouge par un plat végétarien (–3 kg CO₂e).',
      impact: 3,
    },
    {
      condition: transport['dailyDistance'] === true,
      text: '🚲 Privilégie le vélo ou la marche pour les petits trajets (–20 kg CO₂e).',
      impact: 20,
    },
    {
      condition: housing['long_shower'] === true,
      text: '🚿 Raccourcis tes douches chaudes pour économiser l’eau et l’énergie.',
      impact: 1,
    },
  ];

  let suggestion: string | null = null;

  if (dailyImpact < 5) {
    suggestion = '👌 Rien à redire aujourd’hui — continue comme ça !';
  } else {
    const best = suggestionCandidates
      .filter((s) => s.condition)
      .sort((a, b) => b.impact - a.impact)[0];
    if (best) suggestion = best.text;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Titre 🎉 */}
        <Text style={styles.congrats}>🎉 Bien joué, {userInfo?.pseudo ?? 'Toi'} !</Text>

        {/* Progrès sur les objectifs */}
        <Text style={styles.progressText}>
          • 1 / 5 questionnaires journaliers complétés pour tes objectifs
        </Text>

        {/* Impact du jour */}
        <Text style={styles.impactText}>
          • Tu as émis +{dailyImpact.toFixed(0)} kg CO₂e (
          {impactDelta > 0
            ? `↗ +${impactDelta.toFixed(1)} kg`
            : `↘ ${Math.abs(impactDelta).toFixed(1)} kg`}{' '}
          vs hier)
        </Text>

        {/* Équivalence */}
        <Text style={styles.equivalenceText}>
          • Équivalent à {(dailyImpact * 4).toFixed(0)} km en voiture
        </Text>

        {/* Suggestion unique */}
        {suggestion && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>Ce qui peut t’aider demain</Text>
            <Text style={styles.tipSuggestion}>• {suggestion}</Text>
          </View>
        )}

        {/* Streak 🔥 */}
        <Text style={styles.streakText}>Streak 🔥 jours</Text>

        {/* Mini-graph */}
        {/* <MiniGraph /> */}

        {/* Boutons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonValidate}
            onPress={() => navigation.navigate('Accueil')}
          >
            <Text style={styles.buttonText}>Je valide ma journée</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttonTip}>
            <Text style={styles.buttonTipText}>Voir une astuce rapide</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    position: 'absolute',
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  congrats: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#10b981',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  impactText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  equivalenceText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  tipContainer: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  tipSuggestion: {
    fontSize: 14,
    color: '#333',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f59e0b',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonValidate: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonTip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTipText: {
    color: '#111827',
    fontWeight: 'bold',
  },
});

export default DailyResultsScreen;
