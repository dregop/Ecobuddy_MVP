import { CarbonFactors, Results, UserAnswers } from './types';

const carbonFactors: CarbonFactors = {
  transport: {
    car: 0.21, // kg CO₂/km
    public_transport: 0.05,
    bike: 0,
    walking: 0,
  },
  home: {
    energy: 0.2, // kg CO₂/kWh
    size: 10,    // kg CO₂/m²/an
  },
  diet: {
    vegetarian: 2.5,  // kg CO₂/an
    flexitarian: 3.5,
    omnivore: 5,
  },
  flights: {
    short: 300,  // kg CO₂/vol AR
    medium: 700,
    long: 2000,
  },
  purchases: {
    clothing: 50,      // kg CO₂/vêtement neuf
    electronics: 50,   // kg CO₂/an si renouvellement rapide
  },
};
  
  export const calculateCarbonFootprint = (answers: UserAnswers) : Results => {
    console.log(answers);
    const transportEmissions = carbonFactors.transport[answers.transportMode as keyof typeof carbonFactors.transport] * answers.weeklyDistance * 52;
    const homeEmissions = answers.energyConsumption * carbonFactors.home.energy + answers.homeSize * carbonFactors.home.size;
    const dietEmissions = carbonFactors.diet[answers.dietType as keyof typeof carbonFactors.diet] * 365;
    const flightEmissions = answers.yearlyFlights * carbonFactors.flights[answers.flightDistance as keyof typeof carbonFactors.flights];

    const purchasesEmissions = answers.clothingPurchases * carbonFactors.purchases.clothing + answers.electronicsPurchases;


    console.log(purchasesEmissions);
  
    const totalImpact = transportEmissions + homeEmissions + dietEmissions + flightEmissions + purchasesEmissions;

    console.log(totalImpact);

    return {
      totalImpact,
      categoryDetails: {
        transport: transportEmissions,
        food: dietEmissions,
        housing: homeEmissions,
        purchases: purchasesEmissions,
        travel: flightEmissions,
      }
    };
  };
  