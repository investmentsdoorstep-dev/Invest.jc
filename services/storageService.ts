
import { UserProfile, VibeResult } from '../types';

const USER_KEY = 'vibe_ai_user';
const HISTORY_KEY = 'vibe_ai_history';

const defaultUser: UserProfile = {
  onboarded: false,
  isPremium: false,
  theme: 'light',
  notificationsEnabled: true,
  lastScanDate: null,
  dailyScanCount: 0,
  streak: 0,
  onboardingAnswers: {},
  badges: ['early_adopter']
};

export const storageService = {
  getUser: (): UserProfile => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : defaultUser;
  },
  setUser: (user: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getHistory: (): VibeResult[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },
  addResult: (result: VibeResult) => {
    const history = storageService.getHistory();
    localStorage.setItem(HISTORY_KEY, JSON.stringify([result, ...history]));
  }
};
