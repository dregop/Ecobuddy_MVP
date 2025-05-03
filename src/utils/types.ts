export type AppStackParamList = {
  Questionnaire: {
    questions?: any[];
    type?: 'day' | 'week' | 'first'; // Type de questionnaire (jour, semaine ou premier)
  }; // Pas de paramètres pour cet écran
  Résultats: Results;
  Details: {
    categoryDetails: Record<string, number>;
  };
  UserInfo: undefined; // Pas de paramètres pour cet écran
  Login: undefined; // Pas de paramètres pour cet écran
  CompleteRegistration: undefined;
  Accueil: undefined;
  Challenge: undefined;
  DailyResults: undefined;
  WeeklyResults: undefined;
};

export interface CarbonFactors {
  transport: { [key: string]: number }; // Facteurs d'émission (kgCO2/km)
  housing: { energy: number; size: number }; // Énergie et taille du logement
  food: { [key: string]: number }; // Régime alimentaire (kgCO2/jour)
  travel: { [key: string]: number }; // Vols (kgCO2/vol)
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

export type Question = {
  id: number;
  question: string;
  category: 'transport' | 'housing' | 'food' | 'travel' | 'purchases';
  field: string;
  value: any;
  icon: any;
  impact?: any; // Impact carbone associé à la question
};

export type UserAnswers = {
  transport: { [key: string]: any };
  housing: { [key: string]: any };
  food: { [key: string]: any };
  travel: { [key: string]: any };
  purchases: { [key: string]: any };
};

export type UserInfoType = {
  id?: string;
  pseudo: string;
  email: string;
  age: number;
  photoUri?: string | null;
};
