"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDeliveryMovementsApi,
  type DeliveryMovementFilters,
} from "@/components/features/delivery/api/delivery.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useDeliveryMovementsList(
  filters: DeliveryMovementFilters,
  enabled = true,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.delivery.movements(filters),
    queryFn: () => fetchDeliveryMovementsApi(filters),
    enabled: authReady && enabled && Boolean(filters.companyId),
  });
}
