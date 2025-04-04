import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAnswers, UserInfoType } from '../utils/types';

type CategoryDetailsType = { [key: string]: number };

export const defaultAnswers: UserAnswers = {
  transport: {
    transportMode: 'public_transport',
    weeklyDistance: 30,
  },
  housing: {
    homeSize: 50,
    energyConsumption: 2000,
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

type UserDataState = {
  totalImpact: number;
  categoryDetails: CategoryDetailsType;
  answers: UserAnswers;
  userInfo?: UserInfoType;
  setTotalImpact: (impact: number) => void;
  setCategoryDetails: (details: CategoryDetailsType) => void;
  setAnswer: (category: keyof UserAnswers, field: string, value: any) => void;
  setUserInfo: (info: UserInfoType) => void;
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
      userInfo: undefined,
      setTotalImpact: (impact) => set({ totalImpact: impact }),
      setCategoryDetails: (details) => set({ categoryDetails: details }),
      setAnswer: (category, field, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [category]: {
              ...state.answers[category],
              [field]: value,
            },
          },
        })),
      setUserInfo: (info) => set({ userInfo: info }),
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

