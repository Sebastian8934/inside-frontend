import { useAppStore } from "@/stores/app-store";

export function useActiveCompanyId() {
  return useAppStore((state) => state.activeCompanyId);
}

export function useOperativeDate() {
  return useAppStore((state) => state.operativeDate);
}
