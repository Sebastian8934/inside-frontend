"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDeliveryClientSummaryApi,
  type DeliverySummaryFilters,
} from "@/components/features/delivery/api/delivery.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useDeliveryClientSummary(
  filters: DeliverySummaryFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.delivery.clientSummary(filters),
    queryFn: () => fetchDeliveryClientSummaryApi(filters),
    enabled: enabled && Boolean(filters.companyId),
  });
}
