import { RouteProp } from '@react-navigation/native';

export type AppStackParamList = {
  Questionnaire: {
    questions?: any[];
  }; // Pas de paramètres pour cet écran
  Résultats: Results;
  Details: {
    categoryDetails: Record<string, number>;
  };
};

export interface CarbonFactors {
  transport: { [key: string]: number }; // Facteurs d'émission (kgCO2/km)
  home: { energy: number; size: number }; // Énergie et taille du logement
  diet: { [key: string]: number }; // Régime alimentaire (kgCO2/jour)
  flights: { [key: string]: number }; // Vols (kgCO2/vol)
  purchases: { [key: string]: number }; // Vols (kgCO2/vol)
}

export interface Results {
  totalImpact: number;
  categoryDetails: {
    transport: number;
    food: number;
    housing: number;
    purchases: number;
    travel: number;
  };
}