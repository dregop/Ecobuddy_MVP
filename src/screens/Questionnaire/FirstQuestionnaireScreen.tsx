import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { firstQuestions } from '../../data/questions';
import { defaultAnswers } from '../../data/defaultAnswers';
import { useUserDataStore } from '../../store/userDataStore';
import { calculateCarbonFootprint } from '../../utils/calculateCarbon';
import { AppStackParamList, Question, UserAnswers } from '../../utils/types';
import { useAuth } from '../../context/AuthContext';
import { GenericQuestionnaireScreen } from './GenericQuestionnaireScreen';

const FirstQuestionnaireScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const { isLoggedIn } = useAuth();
  const { setAnswer, setTotalImpact, setCategoryDetails } = useUserDataStore();

  const computeAnswer = (
    question: Question,
    direction: 'left' | 'right',
  ): boolean | number | string => {
    return direction === 'right'
      ? question.value
      : defaultAnswers[question.category][question.field];
  };

  const onComplete = async (finalAnswers: UserAnswers) => {
    for (const category of Object.keys(finalAnswers) as (keyof UserAnswers)[]) {
      for (const field in finalAnswers[category]) {
        setAnswer(category, field, finalAnswers[category][field]);
      }
    }

    const results = calculateCarbonFootprint(finalAnswers);
    setTotalImpact(results.totalImpact);
    setCategoryDetails(results.categoryDetails);

    navigation.navigate('UserInfo');
  };

  return (
    <GenericQuestionnaireScreen
      questions={firstQuestions}
      computeAnswer={computeAnswer}
      onComplete={onComplete}
      extraProps={{
        isLoggedIn,
        onLoginPress: () => navigation.navigate('Login'),
      }}
    />
  );
};

export default FirstQuestionnaireScreen;
