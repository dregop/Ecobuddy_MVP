import { UserAnswers } from '../context/UserAnswersContext';
import { CarbonFactors } from './types';

const carbonFactors: CarbonFactors = {
  transport: {
    car: 0.21,
    public_transport: 0.05,
    bike: 0,
    walking: 0,
  },
  home: {
    energy: 0.233,
    size: 10,
  },
  diet: {
    vegetarian: 2.5,
    flexitarian: 3.5,
    omnivore: 5,
  },
  flights: {
    short: 300,
    medium: 700,
    long: 2000,
  },
};
  
  export const calculateCarbonFootprint = (answers: UserAnswers) => {
    console.log(answers);
    const transportEmissions = carbonFactors.transport[answers.transportMode as keyof typeof carbonFactors.transport] * answers.weeklyDistance * 52;
    const homeEmissions = answers.energyConsumption * carbonFactors.home.energy + answers.homeSize * carbonFactors.home.size;
    const dietEmissions = carbonFactors.diet[answers.dietType as keyof typeof carbonFactors.diet] * 365;
    const flightEmissions = answers.yearlyFlights * carbonFactors.flights[answers.flightDistance as keyof typeof carbonFactors.flights];
  
    console.log(transportEmissions);
    console.log(homeEmissions);
    console.log(dietEmissions);
    console.log(flightEmissions);
    return transportEmissions + homeEmissions + dietEmissions + flightEmissions;
  };
  