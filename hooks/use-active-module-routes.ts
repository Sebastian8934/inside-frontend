"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "@/lib/api/permissions";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

/**
 * Rutas de módulos activos (Module.IsActive = true).
 * null mientras carga: el menú no filtra por módulo aún.
 */
export function useActiveModuleRoutes(): {
  activeModuleRoutes: string[] | null;
  isLoading: boolean;
} {
  const enabled = useAuthQueryEnabled();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: queryKeys.modules.all(false),
    queryFn: () => fetchModules(false),
    enabled,
    staleTime: 30_000,
  });

  if (!enabled || (!isFetched && isLoading)) {
    return { activeModuleRoutes: null, isLoading: true };
  }

  const activeModuleRoutes = (data ?? [])
    .map((module) => module.route?.trim())
    .filter((route): route is string => Boolean(route));

  return { activeModuleRoutes, isLoading: false };
}
