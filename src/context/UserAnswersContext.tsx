import React, { createContext, useContext, useState } from 'react';

// Type des réponses utilisateur
export type UserAnswers = {
  transportMode: string;
  weeklyDistance: number;
  homeSize: number;
  energyConsumption: number;
  dietType: string;
  yearlyFlights: number;
  flightDistance: string;
};

const defaultAnswers: UserAnswers = {
  transportMode: 'public_transport',
  weeklyDistance: 60,
  homeSize: 50,
  energyConsumption: 2000,
  dietType: 'flexitarian',
  yearlyFlights: 2,
  flightDistance: 'short',
};

type UserAnswersContextType = {
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  resetAnswers: () => void; // Nouvelle fonction pour réinitialiser
};

const UserAnswersContext = createContext<UserAnswersContextType | undefined>(undefined);

export const UserAnswersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<UserAnswers>(defaultAnswers);

  // Fonction pour réinitialiser les réponses
  const resetAnswers = () => {
    setAnswers(defaultAnswers);
  };

  return (
    <UserAnswersContext.Provider value={{ answers, setAnswers, resetAnswers }}>
      {children}
    </UserAnswersContext.Provider>
  );
};

export const useUserAnswers = () => {
  const context = useContext(UserAnswersContext);
  if (!context) {
    throw new Error('useUserAnswers must be used within a UserAnswersProvider');
  }
  return context;
};
