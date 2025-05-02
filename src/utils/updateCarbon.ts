import { dayQuestions } from '../data/questions';

export function updateCarbonFootprint(dailyAnswers: { [field: string]: any }): number {
  let additionalImpact = 0;

  console.log(dayQuestions);
  console.log(dailyAnswers);

  dayQuestions.forEach((question: { category: string | number }) => {
    const userResponse = dailyAnswers[question.category];

    console.log('userResponse', userResponse);

    if (userResponse) {
      switch (question.category) {
        case 'food':
          additionalImpact += 5; // Exemple : 5 kg CO₂ pour un repas avec viande
          break;

        case 'transport':
          additionalImpact += 2; // Exemple : 2 kg CO₂ pour un petit trajet voiture
          break;

        case 'purchases':
          additionalImpact += 15; // Exemple : 15 kg CO₂ pour l'achat d'un vêtement neuf
          break;

        case 'housing':
          additionalImpact += 1; // Exemple : 1 kg CO₂ pour gaspillage d'eau chaude
          break;

        default:
          break;
      }
    }
  });

  return additionalImpact;
}
