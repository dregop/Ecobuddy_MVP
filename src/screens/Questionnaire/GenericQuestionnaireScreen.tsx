import React, { useState } from 'react';
import { Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { QuestionnaireLayout } from '../../components/QuestionnaireLayout';
import { AppStackParamList, Question, UserAnswers } from '../../utils/types';
import { useSwipe } from '../../hooks/useSwipe';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;

interface GenericQuestionnaireScreenProps {
  questions: Question[];
  computeAnswer: (question: Question, direction: 'left' | 'right') => boolean | number | string;
  onComplete: (answers: UserAnswers) => Promise<void> | void;
  extraProps?: Record<string, unknown>;
}

export const GenericQuestionnaireScreen: React.FC<GenericQuestionnaireScreenProps> = ({
  questions,
  computeAnswer,
  onComplete,
  extraProps = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({
    transport: {},
    housing: {},
    food: {},
    travel: {},
    purchases: {},
  });

  const navigation = useNavigation<NavigationProp>();
  const { position, panResponder } = useSwipe((direction) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      processNextQuestion(direction as 'left' | 'right');
    });
  });

  const processNextQuestion = async (direction: 'left' | 'right') => {
    const current = questions[currentIndex];
    const nextIndex = currentIndex + 1;
    const answer = computeAnswer(current, direction);

    const updatedCategory = {
      ...answers[current.category],
      [current.field]: answer,
    };

    const updatedAnswers: UserAnswers = {
      ...answers,
      [current.category]: updatedCategory,
    };

    setAnswers(updatedAnswers);

    if (nextIndex >= questions.length) {
      await onComplete(updatedAnswers);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <QuestionnaireLayout
      question={questions[currentIndex]}
      questionIndex={currentIndex}
      totalQuestions={questions.length}
      position={position}
      panHandlers={panResponder.panHandlers}
      onSwipeLeft={() => processNextQuestion('left')}
      onSwipeRight={() => processNextQuestion('right')}
      {...extraProps}
    />
  );
};
