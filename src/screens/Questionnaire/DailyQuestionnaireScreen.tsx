import React, { useState } from 'react';
import { Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserDataStore } from '../../store/userDataStore';
import { useSwipe } from '../../hooks/useSwipe';
import { dayQuestions } from '../../data/questions';
import { updateCarbonFootprint } from '../../utils/updateCarbon';
import { getYesterdayImpact } from '../../utils/getYesterdayImpact';
import { AppStackParamList, Question } from '../../utils/types';
import { QuestionnaireLayout } from '../../components/QuestionnaireLayout';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;

const DailyQuestionnaireScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const questions: Question[] = dayQuestions;

  const store = useUserDataStore.getState();

  const handleSwipe = (direction: string) => {
    const answerValue = direction === 'right';

    Animated.timing(position, {
      toValue: { x: answerValue ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      processNextQuestion(answerValue);
    });
  };

  const processNextQuestion = async (answerValue: boolean) => {
    const current = questions[currentIndex];
    const nextIndex = currentIndex + 1;

    store.setAnswer(current.category, current.field, answerValue);

    const updatedAnswers = {
      ...store.answers,
      [current.category]: {
        ...store.answers[current.category],
        [current.field]: answerValue,
      },
    };

    if (nextIndex >= questions.length) {
      const todayImpact = updateCarbonFootprint(updatedAnswers);

      if (store.userInfo?.id) {
        const yesterdayImpact = await getYesterdayImpact(store.userInfo.id);
        const impactDelta = yesterdayImpact !== undefined ? todayImpact - yesterdayImpact : 0;

        store.setDailyImpact(todayImpact);
        store.setImpactDelta(impactDelta);
        await store.saveDailyImpactToBackend();

        navigation.navigate('DailyResults');
      } else {
        console.error('User ID is not available in the store.');
      }
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
    />
  );
};

export default DailyQuestionnaireScreen;
