import { create } from "zustand";
import type { UserInfo } from "@/types/auth";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  user: UserInfo | null;
  status: AuthStatus;
  isInitialized: boolean;
  setSession: (accessToken: string, expiresAt: string, user: UserInfo) => void;
  setStatus: (status: AuthStatus) => void;
  setInitialized: (initialized: boolean) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  expiresAt: null,
  user: null,
  status: "idle",
  isInitialized: false,
  setSession: (accessToken, expiresAt, user) =>
    set({
      accessToken,
      expiresAt,
      user,
      status: "authenticated",
    }),
  setStatus: (status) => set({ status }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearSession: () =>
    set({
      accessToken: null,
      expiresAt: null,
      user: null,
      status: "unauthenticated",
    }),
}));

export const getAccessToken = () => useAuthStore.getState().accessToken;

export const isAuthenticated = () =>
  Boolean(useAuthStore.getState().accessToken && useAuthStore.getState().user);
