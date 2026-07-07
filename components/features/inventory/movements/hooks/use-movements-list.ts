"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMovementsApi,
  type MovementFilters,
} from "@/components/features/inventory/movements/api/movements.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useMovementsList(filters: MovementFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.inventory.movements(filters),
    queryFn: () => fetchMovementsApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
