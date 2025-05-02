import { UserAnswers } from '../utils/types';

export const defaultAnswers: UserAnswers = {
  transport: {
    transportMode: 'public_transport',
    weeklyDistance: 80,
  },
  housing: {
    homeSize: 50,
    energyConsumption: 5000,
  },
  food: {
    dietType: 'flexitarian',
  },
  travel: {
    yearlyFlights: 1,
    flightDistance: 'medium',
  },
  purchases: {
    clothingPurchases: 12,
    electronicsPurchases: 50,
  },
};
