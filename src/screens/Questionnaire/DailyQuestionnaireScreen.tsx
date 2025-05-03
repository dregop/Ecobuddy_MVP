import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { dayQuestions } from '../../data/questions';
import { useUserDataStore } from '../../store/userDataStore';
import { updateCarbonFootprint } from '../../utils/updateCarbon';
import { getYesterdayImpact } from '../../utils/getYesterdayImpact';
import { AppStackParamList, Question, UserAnswers } from '../../utils/types';
import { GenericQuestionnaireScreen } from './GenericQuestionnaireScreen';

const DailyQuestionnaireScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const store = useUserDataStore.getState();

  const computeAnswer = (question: Question, direction: 'left' | 'right'): boolean => {
    return direction === 'right';
  };

  const onComplete = async (finalAnswers: UserAnswers) => {
    for (const category of Object.keys(finalAnswers) as (keyof UserAnswers)[]) {
      for (const field in finalAnswers[category]) {
        store.setAnswer(category, field, finalAnswers[category][field]);
      }
    }

    const todayImpact = updateCarbonFootprint(finalAnswers);

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
  };

  return (
    <GenericQuestionnaireScreen
      questions={dayQuestions}
      computeAnswer={computeAnswer}
      onComplete={onComplete}
    />
  );
};

export default DailyQuestionnaireScreen;
