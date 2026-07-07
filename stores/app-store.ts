import { create } from "zustand";

type AppState = {
  activeCompanyId: number | null;
  sidebarOpen: boolean;
  setActiveCompanyId: (companyId: number | null) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  resetAppState: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeCompanyId: null,
  sidebarOpen: true,
  setActiveCompanyId: (activeCompanyId) => set({ activeCompanyId }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  resetAppState: () =>
    set({
      activeCompanyId: null,
      sidebarOpen: true,
    }),
}));
