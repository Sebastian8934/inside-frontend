"use client";

import {
  isClientOnly,
  isOperator,
  isSuperUser,
} from "@/lib/auth/permissions";
import { normalizeRoleIds } from "@/config/roles";
import { useAuthStore } from "@/stores/auth-store";

export function useUserRoles() {
  const roles = useAuthStore((state) => state.user?.roles ?? []);
  return normalizeRoleIds(roles);
}

export function useUserPermissions() {
  return useAuthStore((state) => state.user?.permissions ?? []);
}

export function useIsOperator() {
  const roles = useUserRoles();
  return isOperator(roles);
}

export function useIsClientOnly() {
  const roles = useUserRoles();
  return isClientOnly(roles);
}

export function useIsSuperUser() {
  const roles = useUserRoles();
  return isSuperUser(roles);
}
