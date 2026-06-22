"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDeliveryMovementsApi,
  type DeliveryMovementFilters,
} from "@/components/features/delivery/api/delivery.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useDeliveryMovementsList(
  filters: DeliveryMovementFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.delivery.movements(filters),
    queryFn: () => fetchDeliveryMovementsApi(filters),
    enabled: enabled && Boolean(filters.companyId),
  });
}
