"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchOtcSummaryApi,
  type OtcSummaryFilters,
} from "@/components/features/inventory/otc-summary/api/otc-summary.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useOtcSummaryList(filters: OtcSummaryFilters) {
  return useQuery({
    queryKey: queryKeys.inventory.otcSummary(filters),
    queryFn: () => fetchOtcSummaryApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
