import React, { useState } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList, Question, Results } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { calculateCarbonFootprint } from '../utils/calculateCarbon';
import { defaultAnswers, useUserDataStore } from '../store/userDataStore';
import QuestionCard from '../components/QuestionCard';
import { useSwipe } from '../hooks/useSwipe';
import { firstQuestions, dayQuestions } from '../data/questions';
import { useAuth } from '../context/AuthContext';

// Obtient la largeur de l'écran, utilisée pour les calculs de swipe
const { width } = Dimensions.get('window');

// Typage pour la navigation
type QuestionnaireScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;
type QuestionnaireScreenRouteProp = RouteProp<AppStackParamList, 'Questionnaire'>;

const QuestionnaireScreen = () => {
  const route = useRoute<QuestionnaireScreenRouteProp>();
  const quizzType = route.params?.type === 'day' ? 'day' : 'first'; // Vérifie le type de questionnaire
  const questions: Question[] = quizzType === 'day' ? dayQuestions : firstQuestions;

  // Stocke l'index de la question actuelle
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isLoggedIn, user } = useAuth();

  const { setAnswer, answers, setTotalImpact, setCategoryDetails, totalImpact } =
    useUserDataStore();

  // Utilise la navigation pour passer à l'écran des résultats
  const navigation = useNavigation<QuestionnaireScreenNavigationProp>();

  // Gère le swipe gauche ou droit
  const handleSwipe = (direction: string) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 }, // Anime la carte hors de l'écran
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 }); // Réinitialise la position

      // Passe à la question suivante ou calcule les résultats
      setCurrentIndex((prevIndex) => {
        const currentQuestion = questions[prevIndex];
        const nextIndex = prevIndex + 1;

        // Met à jour la réponse dans le store
        setAnswer(
          currentQuestion.category,
          currentQuestion.field,
          direction === 'right'
            ? currentQuestion.value
            : defaultAnswers[currentQuestion.category][currentQuestion.field],
        );

        // Prépare les réponses mises à jour
        const updatedAnswers = {
          ...answers,
          [currentQuestion.category]: {
            ...answers[currentQuestion.category],
            [currentQuestion.field]:
              direction === 'right'
                ? currentQuestion.value
                : defaultAnswers[currentQuestion.category][currentQuestion.field],
          },
        };

        // Si Global Quiz → recalcul à chaque swipe
        if (quizzType === 'day') {
          const footprint: Results = calculateCarbonFootprint(updatedAnswers);
          setTotalImpact(footprint.totalImpact);
          setCategoryDetails(footprint.categoryDetails);
        }

        // Si fin du questionnaire classique → calcul final
        if (quizzType === 'first' && nextIndex >= questions.length) {
          const footprint: Results = calculateCarbonFootprint(updatedAnswers);
          setTotalImpact(footprint.totalImpact);
          setCategoryDetails(footprint.categoryDetails);
          navigation.navigate('UserInfo');
        }

        // Boucle infinie en Global Quiz
        return quizzType === 'day'
          ? nextIndex % questions.length
          : nextIndex < questions.length
          ? nextIndex
          : prevIndex;
      });
    });
  };

  const { position, panResponder } = useSwipe(handleSwipe);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {quizzType === 'day'
            ? `Empreinte : ${totalImpact.toFixed(2)} kg CO₂`
            : `Question : ${currentIndex + 1} / ${questions.length}`}
        </Text>
      </View>

      {/* Carte animée de la question */}
      <QuestionCard
        question={questions[currentIndex]}
        position={position}
        panHandlers={panResponder.panHandlers}
        onSwipeLeft={() => handleSwipe('left')}
        onSwipeRight={() => handleSwipe('right')}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.returnLink}>
        <Text style={styles.returnText}>← Connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 10, // Place le compteur en haut de l'écran
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  returnLink: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  returnText: {
    fontSize: 20,
    color: '#FFF',
    textDecorationLine: 'underline',
  },
});

export default QuestionnaireScreen;
