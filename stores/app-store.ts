import { create } from "zustand";

type AppState = {
  operativeDate: Date;
  activeCompanyId: number | null;
  sidebarOpen: boolean;
  setOperativeDate: (date: Date) => void;
  setActiveCompanyId: (companyId: number | null) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  operativeDate: new Date(),
  activeCompanyId: null,
  sidebarOpen: true,
  setOperativeDate: (operativeDate) => set({ operativeDate }),
  setActiveCompanyId: (activeCompanyId) => set({ activeCompanyId }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
