"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWithdrawalDaysApi,
  type WithdrawalDayFilters,
} from "@/components/features/withdrawals/api/withdrawals.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useWithdrawalDays(filters: WithdrawalDayFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.withdrawals.days(filters),
    queryFn: () => fetchWithdrawalDaysApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
