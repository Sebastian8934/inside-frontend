"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDeliveryClientSummary,
  type DeliverySummaryFilters,
} from "@/lib/api/delivery";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useDeliveryClientsReport(
  filters: DeliverySummaryFilters,
  enabled = true,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.delivery.clientSummary(filters),
    queryFn: () => fetchDeliveryClientSummary(filters),
    enabled: authReady && enabled && Boolean(filters.companyId),
  });
}
