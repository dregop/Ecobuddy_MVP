import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../utils/types';
import FirstQuestionnaireScreen from './FirstQuestionnaireScreen';
import DailyQuestionnaireScreen from './DailyQuestionnaireScreen';

type QuestionnaireScreenRouteProp = RouteProp<AppStackParamList, 'Questionnaire'>;

const QuestionnaireWrapper = () => {
  const route = useRoute<QuestionnaireScreenRouteProp>();
  const quizzType = route.params?.type === 'day' ? 'day' : 'first';

  if (quizzType === 'day') {
    return <DailyQuestionnaireScreen />;
  }

  return <FirstQuestionnaireScreen />;
};

export default QuestionnaireWrapper;
