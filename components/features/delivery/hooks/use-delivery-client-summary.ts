"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDeliveryClientSummaryApi,
  type DeliverySummaryFilters,
} from "@/components/features/delivery/api/delivery.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useDeliveryClientSummary(
  filters: DeliverySummaryFilters,
  enabled = true,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.delivery.clientSummary(filters),
    queryFn: () => fetchDeliveryClientSummaryApi(filters),
    enabled: authReady && enabled && Boolean(filters.companyId),
  });
}
