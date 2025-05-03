import { dayQuestions } from '../data/questions';
import { UserAnswers } from '../utils/types';

export function updateCarbonFootprint(dailyAnswers: UserAnswers): number {
  let totalImpact = 0;

  dayQuestions.forEach((question) => {
    const { category, field, impact } = question;
    const response = dailyAnswers[category]?.[field];

    if (typeof response !== 'undefined' && impact) {
      const responseImpact = impact[response] ?? 0;
      totalImpact += responseImpact;
    }
  });

  return totalImpact;
}
