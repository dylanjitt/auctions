import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../interfaces/userInterface";

interface authStoreInterface {
  user: User;
  isAuthenticated: boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<authStoreInterface>()(
  persist(
    (set) => ({
      user: {} as User,
      isAuthenticated: false,
      loginUser: (user: User) => set({ user, isAuthenticated: true }),
      logoutUser: () => set({ user: {} as User, isAuthenticated: false }),
    }),
    { name: "auth" }
  )
);