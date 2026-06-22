"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWithdrawalConsolidatedApi,
  type WithdrawalConsolidatedFilters,
} from "@/components/features/withdrawals/api/withdrawals.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useWithdrawalConsolidatedList(
  filters: WithdrawalConsolidatedFilters,
) {
  return useQuery({
    queryKey: queryKeys.withdrawals.consolidated(filters),
    queryFn: () => fetchWithdrawalConsolidatedApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
