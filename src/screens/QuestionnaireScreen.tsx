import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, PanResponder, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList, Question, Results } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { calculateCarbonFootprint } from '../utils/calculateCarbon';
import { useUserDataStore } from '../store/userDataStore';
import QuestionCard from '../components/QuestionCard';
import { useSwipe } from '../hooks/useSwipe';
import { firstQuestions } from '../data/questions';

// Obtient la largeur de l'écran, utilisée pour les calculs de swipe
const { width } = Dimensions.get('window');

// Typage pour la navigation
type QuestionnaireScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;
type QuestionnaireScreenRouteProp = RouteProp<AppStackParamList, 'Questionnaire'>;


const QuestionnaireScreen = () => {
  const route = useRoute<QuestionnaireScreenRouteProp>();
  const questions: Question[] = route.params?.questions ?? firstQuestions;

  // Stocke l'index de la question actuelle
  const [currentIndex, setCurrentIndex] = useState(0);

  const { setAnswer, answers, setTotalImpact, setCategoryDetails } = useUserDataStore();

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

        // Mise à jour Zustand store
        setAnswer(
          currentQuestion.field,
          direction === 'right' ? currentQuestion.value : answers[currentQuestion.field]
        );

        // Fin questionnaire → calcul impact
        if (nextIndex >= questions.length) {
          const footprint: Results = calculateCarbonFootprint({
            ...answers,
            [currentQuestion.field]:
              direction === 'right' ? currentQuestion.value : answers[currentQuestion.field],
          });

          setTotalImpact(footprint.totalImpact);
          setCategoryDetails(footprint.categoryDetails);

          navigation.navigate('Résultats');
        }

        return nextIndex < questions.length ? nextIndex : prevIndex; // Passe à la prochaine question
      });
    });
  };

  const { position, panResponder } = useSwipe(handleSwipe);



  // Affiche un écran de fin si toutes les questions ont été répondues
  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Vous avez terminé le questionnaire !</Text>
      </View>
    );
  }

  return (
   <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Questions : {currentIndex + 1} / {questions.length} {/* Affiche le numéro de la question */}
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
});

export default QuestionnaireScreen;
