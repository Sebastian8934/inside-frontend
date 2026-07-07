"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchOtcSummaryApi,
  type OtcSummaryFilters,
} from "@/components/features/inventory/otc-summary/api/otc-summary.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useOtcSummaryList(filters: OtcSummaryFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.inventory.otcSummary(filters),
    queryFn: () => fetchOtcSummaryApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
