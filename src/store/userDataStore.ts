import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAnswers } from '../utils/types';

type CategoryDetailsType = { [key: string]: number };

const defaultAnswers: UserAnswers = {
  transportMode: 'public_transport',
  weeklyDistance: 30,
  homeSize: 50,
  energyConsumption: 2000,
  dietType: 'flexitarian',
  yearlyFlights: 1,
  flightDistance: 'medium',
  clothingPurchases: 12,
  electronicsPurchases: 50,
};

type UserDataState = {
  totalImpact: number;
  categoryDetails: CategoryDetailsType;
  answers: UserAnswers;
  setTotalImpact: (impact: number) => void;
  setCategoryDetails: (details: CategoryDetailsType) => void;
  setAnswer: (field: string, value: any) => void;
  resetAnswers: () => void;
  fetchImpactFromBackend: (userId: string) => Promise<void>;
  resetImpact: () => void;
};

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      totalImpact: 0,
      categoryDetails: {},
      answers: defaultAnswers,
      setTotalImpact: (impact) => set({ totalImpact: impact }),
      setCategoryDetails: (details) => set({ categoryDetails: details }),
      setAnswer: (field, value) =>
        set((state) => ({
          answers: { ...state.answers, [field]: value },
        })),
      resetAnswers: () => set({ answers: defaultAnswers }),
      fetchImpactFromBackend: async (userId) => {
        try {
          const response = await fetch(`https://your-backend.com/api/users/${userId}/impact`);
          const data = await response.json();

          set({
            totalImpact: data.totalImpact,
            categoryDetails: data.categoryDetails,
            answers: data.answers ?? {},
          });
        } catch (error) {
          console.error('Error fetching data from backend:', error);
        }
      },
      resetImpact: () => set({ totalImpact: 0, categoryDetails: {} }),
    }),
    {
      name: 'user-data-storage',
      storage: AsyncStorage as any, //FIXME: Remove any when AsyncStorage is updated
    }
  )
);
