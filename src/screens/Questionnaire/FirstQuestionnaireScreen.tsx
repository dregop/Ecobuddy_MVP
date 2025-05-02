import React, { useState } from 'react';
import { Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { calculateCarbonFootprint } from '../../utils/calculateCarbon';
import { useUserDataStore } from '../../store/userDataStore';
import { useSwipe } from '../../hooks/useSwipe';
import { firstQuestions } from '../../data/questions';
import { defaultAnswers } from '../../data/defaultAnswers';
import { AppStackParamList, Question, Results } from '../../utils/types';
import { useAuth } from '../../context/AuthContext';
import { QuestionnaireLayout } from '../../components/QuestionnaireLayout';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;

const FirstQuestionnaireScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const { setAnswer, answers, setTotalImpact, setCategoryDetails } = useUserDataStore();
  const { isLoggedIn } = useAuth();
  const questions: Question[] = firstQuestions;

  const handleSwipe = (direction: string) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      processNextQuestion(direction);
    });
  };

  const processNextQuestion = (direction: string) => {
    const current = questions[currentIndex];
    const nextIndex = currentIndex + 1;

    const answer =
      direction === 'right' ? current.value : defaultAnswers[current.category][current.field];

    setAnswer(current.category, current.field, answer);

    const updatedAnswers = {
      ...answers,
      [current.category]: {
        ...answers[current.category],
        [current.field]: answer,
      },
    };

    if (nextIndex >= questions.length) {
      const results: Results = calculateCarbonFootprint(updatedAnswers);
      setTotalImpact(results.totalImpact);
      setCategoryDetails(results.categoryDetails);
      navigation.navigate('UserInfo');
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const { position, panResponder } = useSwipe(handleSwipe);

  return (
    <QuestionnaireLayout
      question={questions[currentIndex]}
      questionIndex={currentIndex}
      totalQuestions={questions.length}
      position={position}
      panHandlers={panResponder.panHandlers}
      onSwipeLeft={() => handleSwipe('left')}
      onSwipeRight={() => handleSwipe('right')}
      isLoggedIn={isLoggedIn}
      onLoginPress={() => navigation.navigate('Login')}
    />
  );
};

export default FirstQuestionnaireScreen;
