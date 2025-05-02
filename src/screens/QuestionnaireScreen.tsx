import React, { useState } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList, Question, Results } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { calculateCarbonFootprint } from '../utils/calculateCarbon';
import { useUserDataStore } from '../store/userDataStore';
import QuestionCard from '../components/QuestionCard';
import { useSwipe } from '../hooks/useSwipe';
import { firstQuestions, dayQuestions } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import { defaultAnswers } from '../data/defaultAnswers';
import { updateCarbonFootprint } from '../utils/updateCarbon';
import { getYesterdayImpact } from '../utils/getYesterdayImpact';

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
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      processNextQuestion(direction); // 👈 Appel de la fonction async proprement
    });
  };

  const processNextQuestion = async (direction: string) => {
    const currentQuestion = questions[currentIndex];
    const nextIndex = currentIndex + 1;

    // Met à jour la réponse dans le store
    setAnswer(
      currentQuestion.category,
      currentQuestion.field,
      direction === 'right'
        ? currentQuestion.value
        : defaultAnswers[currentQuestion.category][currentQuestion.field],
    );

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

    if (nextIndex >= questions.length) {
      if (quizzType === 'first') {
        const footprint: Results = calculateCarbonFootprint(updatedAnswers);
        setTotalImpact(footprint.totalImpact);
        setCategoryDetails(footprint.categoryDetails);
        navigation.navigate('UserInfo');
      } else if (quizzType === 'day') {
        const store = useUserDataStore.getState();
        const todayImpact: number = updateCarbonFootprint(updatedAnswers);

        if (store.userInfo?.id) {
          const yesterdayImpact = await getYesterdayImpact(store.userInfo?.id);
          const impactDelta = yesterdayImpact !== undefined ? todayImpact - yesterdayImpact : 0;
          // const streak = await calculateStreakDays(store.userInfo?.id);

          store.setDailyImpact(todayImpact);
          store.setImpactDelta(impactDelta);
          // store.setStreakDays(streak);

          await store.saveDailyImpactToBackend();

          navigation.navigate('DailyResults');
        } else {
          console.error('User ID is not available in the store.');
        }
      }
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const { position, panResponder } = useSwipe(handleSwipe);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question : {currentIndex + 1} / {questions.length}
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

      {!isLoggedIn && (
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.returnLink}>
          <Text style={styles.returnText}>← Connexion</Text>
        </TouchableOpacity>
      )}
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
