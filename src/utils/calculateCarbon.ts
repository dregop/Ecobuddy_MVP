import { carbonFactors } from '../data/carbonFactors';
import { CarbonFactors, Results, UserAnswers } from './types';

function getFactorForField(category: keyof CarbonFactors, field: string, value: any): number {
  switch (category) {
    case 'transport':
      return carbonFactors.transport[value] ?? 0.21;
    case 'housing':
      if (field === 'energyConsumption') return carbonFactors.housing.energy;
      if (field === 'homeSize') return carbonFactors.housing.size;
      return 0;
    case 'food':
      return carbonFactors.food[value] ?? 3.5;
    case 'travel':
      if (field === 'yearlyFlights') return carbonFactors.travel.medium;
      if (field === 'flightDistance') return carbonFactors.travel[value] ?? 1000;
      return 0;
    case 'purchases':
      if (field === 'clothingPurchases') return carbonFactors.purchases.clothing;
      if (field === 'electronicsPurchases') return carbonFactors.purchases.electronics;
      return 0;
    default:
      return 0;
  }
}

export function calculateCarbonFootprint(answers: UserAnswers): Results {
  let totalImpact = 0;
  const categoryDetails: Results['categoryDetails'] = {
    transport: 0,
    food: 0,
    housing: 0,
    purchases: 0,
    travel: 0,
  };

  Object.entries(answers).forEach(([categoryKey, fields]) => {
    const category = categoryKey as keyof UserAnswers;

    Object.entries(fields).forEach(([field, value]) => {
      const factor = getFactorForField(category, field, value);

      let impact = 0;

      switch (category) {
        case 'transport':
          if (field === 'weeklyDistance') {
            // Convert km/semaine → km/an
            impact = value * 52 * factor;
          } else if (field === 'transportMode') {
            // Mode de transport → facteur direct
            impact = factor;
          }
          break;

        case 'housing':
          if (field === 'homeSize') {
            impact = value * factor; // m² × 10 kg/m²/an
          }
          if (field === 'energyConsumption') {
            impact = value * factor; // kWh × 0.2 kg/kWh
          }
          break;

        case 'food':
          // Régime alimentaire → kg CO₂/jour × 365 jours
          impact = factor * 365;
          break;

        case 'travel':
          if (field === 'yearlyFlights') {
            // Nombre de vols × impact moyen
            impact = value * factor;
          }
          if (field === 'flightDistance') {
            // long/short → factor direct
            impact = factor;
          }
          break;

        case 'purchases':
          if (field === 'clothingPurchases') {
            impact = value * factor; // Nombre vêtements × kg/vêtement
          }
          if (field === 'electronicsPurchases') {
            impact = value; // Déjà en kg CO2/an
          }
          break;
      }

      categoryDetails[category] += impact;
      totalImpact += impact;
    });
  });

  return { totalImpact, categoryDetails };
}
