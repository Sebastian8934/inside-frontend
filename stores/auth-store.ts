import { create } from "zustand";
import type { UserInfo } from "@/types/auth";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  expiresAt: string | null;
  user: UserInfo | null;
  status: AuthStatus;
  isInitialized: boolean;
  setSession: (expiresAt: string, user: UserInfo) => void;
  setStatus: (status: AuthStatus) => void;
  setInitialized: (initialized: boolean) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  expiresAt: null,
  user: null,
  status: "idle",
  isInitialized: false,
  setSession: (expiresAt, user) =>
    set({
      expiresAt,
      user,
      status: "authenticated",
    }),
  setStatus: (status) => set({ status }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearSession: () =>
    set({
      expiresAt: null,
      user: null,
      status: "unauthenticated",
    }),
}));
