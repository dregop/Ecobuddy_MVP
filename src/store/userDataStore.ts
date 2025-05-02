import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAnswers, UserInfoType } from '../utils/types';
import { defaultAnswers } from '../data/defaultAnswers';

type CategoryDetailsType = { [key: string]: number };

type UserDataState = {
  totalImpact: number;
  categoryDetails: CategoryDetailsType;
  answers: UserAnswers;
  userInfo?: UserInfoType;
  dailyImpact: number;
  impactDelta: number;
  streakDays: number;
  setTotalImpact: (impact: number) => void;
  setCategoryDetails: (details: CategoryDetailsType) => void;
  setAnswer: (category: keyof UserAnswers, field: string, value: any) => void;
  setUserInfo: (info: UserInfoType) => void;
  resetUserData: () => void;
  resetAnswers: () => void;
  saveImpactToBackend: () => Promise<void>;
  fetchImpactFromBackend: (userId: string) => Promise<void>;
  resetImpact: () => void;
  setDailyImpact: (value: number) => void;
  setImpactDelta: (value: number) => void;
  setStreakDays: (days: number) => void;
  saveDailyImpactToBackend: () => Promise<void>;
};

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      totalImpact: 0,
      categoryDetails: {},
      answers: defaultAnswers,
      userInfo: undefined,
      dailyImpact: 0,
      impactDelta: 0,
      streakDays: 0,
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
      setDailyImpact: (value) => set({ dailyImpact: value }),
      setImpactDelta: (value) => set({ impactDelta: value }),
      setStreakDays: (days) => set({ streakDays: days }),
      saveDailyImpactToBackend: async () => {
        const state = useUserDataStore.getState();
        const { userInfo, dailyImpact, impactDelta, streakDays } = state;

        if (!userInfo?.id) {
          console.warn('[saveDailyImpactToBackend] Aucun utilisateur connecté');
          return;
        }

        try {
          const response = await fetch(`${process.env.API_URL}/daily-impact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              userId: userInfo.id,
              date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
              dailyImpact,
              impactDelta,
              streakDays,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('[saveDailyImpactToBackend] Erreur:', error);
            return;
          }

          const data = await response.json();
          console.log('[saveDailyImpactToBackend] Sauvegarde journalier réussie :', data);
        } catch (err) {
          console.error('[saveDailyImpactToBackend] Exception :', err);
        }
      },
    }),
    {
      name: 'user-data-storage',
      storage: AsyncStorage as any, //FIXME: Remove any
    },
  ),
);
