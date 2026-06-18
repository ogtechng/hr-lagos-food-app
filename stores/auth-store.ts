import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "hr" | "manager" | "staff";
} | null;

type AuthState = {
  user: User;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isLoading: false }),
}));
