import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading?: number;
} | null;

interface RiderStoreProps {
  user: any;
  location: CustomLocation;
  onDuty: boolean;
  dailyEarnings: number; // 🆕 bénéfices journaliers
  setUser: (data: any) => void;
  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  addEarnings: (amount: number) => void; // 🆕 ajout bénéfice
  resetEarnings: () => void; // 🆕 reset bénéfices
  clearRiderData: () => void;
}


export const riderStore = create<RiderStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,
      dailyEarnings: 0, // 🆕 initialisé à 0
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOnDuty: (data) => set({ onDuty: data }),
      addEarnings: (amount) =>
        set((state) => ({ dailyEarnings: state.dailyEarnings + amount })), // 🆕
      resetEarnings: () => set({ dailyEarnings: 0 }), // 🆕
      clearRiderData: () =>
        set({ user: null, location: null, onDuty: false, dailyEarnings: 0 }),
    }),
    {
      name: "rider-store",
      partialize: (state) => ({
        user: state.user,
        dailyEarnings: state.dailyEarnings, // 🆕 on le garde en mémoire persistante
      }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)