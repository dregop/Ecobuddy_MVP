import { RouteProp } from '@react-navigation/native';

export type AppStackParamList = {
  Questionnaire: undefined; // Pas de paramètres pour cet écran
  Résultats: { totalImpact: number }; // L'écran Résultats reçoit un totalImpact
};

// Typage spécifique pour les props de ResultsScreen
type ResultsScreenRouteProp = RouteProp<AppStackParamList, 'Résultats'>;

export interface CarbonFactors {
  transport: { [key: string]: number }; // Facteurs d'émission (kgCO2/km)
  home: { energy: number; size: number }; // Énergie et taille du logement
  diet: { [key: string]: number }; // Régime alimentaire (kgCO2/jour)
  flights: { [key: string]: number }; // Vols (kgCO2/vol)
}