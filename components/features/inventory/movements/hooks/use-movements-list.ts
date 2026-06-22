"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMovementsApi,
  type MovementFilters,
} from "@/components/features/inventory/movements/api/movements.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useMovementsList(filters: MovementFilters) {
  return useQuery({
    queryKey: queryKeys.inventory.movements(filters),
    queryFn: () => fetchMovementsApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
