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
  resetUserData: () => void;
  resetAnswers: () => void;
  saveImpactToBackend: () => Promise<void>;
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
      resetUserData: () => set({ userInfo: undefined }),
      resetAnswers: () => set({ answers: defaultAnswers }),
      saveImpactToBackend: async () => {
        const state = useUserDataStore.getState();
        const { userInfo, totalImpact, categoryDetails, answers } = state;

        if (!userInfo?.id) {
          console.warn('[saveImpactToBackend] Aucun utilisateur connecté');
          return;
        }

        try {
          const response = await fetch(`${process.env.API_URL}/impact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              userId: userInfo.id,
              totalImpact,
              categoryDetails,
              answers,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('[saveImpactToBackend] Erreur:', error);
            return;
          }

          const data = await response.json();
          console.log('[saveImpactToBackend] Sauvegarde réussie :', data);
        } catch (err) {
          console.error('[saveImpactToBackend] Exception :', err);
        }
      },
      fetchImpactFromBackend: async (userId) => {
        try {
          const response = await fetch(`${process.env.API_URL}/impact/${userId}`);
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

