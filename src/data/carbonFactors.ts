import { CarbonFactors } from '../utils/types';

export const carbonFactors: CarbonFactors = {
  transport: {
    car: 0.21, // kg CO₂/km
    public_transport: 0.05,
    bike: 0,
    walking: 0,
  },
  housing: {
    energy: 0.2, // kg CO₂/kWh
    size: 10, // kg CO₂/m²/an
  },
  food: {
    vegetarian: 2.5, // kg CO₂/an
    flexitarian: 3.5,
    omnivore: 5,
  },
  travel: {
    short: 300, // kg CO₂/vol AR
    medium: 700,
    long: 2000,
  },
  purchases: {
    clothing: 50, // kg CO₂/vêtement neuf
    electronics: 50, // kg CO₂/an si renouvellement rapide
  },
};
