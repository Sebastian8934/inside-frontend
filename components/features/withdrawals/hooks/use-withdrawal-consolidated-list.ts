"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWithdrawalConsolidatedApi,
  type WithdrawalConsolidatedFilters,
} from "@/components/features/withdrawals/api/withdrawals.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useWithdrawalConsolidatedList(
  filters: WithdrawalConsolidatedFilters,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.withdrawals.consolidated(filters),
    queryFn: () => fetchWithdrawalConsolidatedApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
