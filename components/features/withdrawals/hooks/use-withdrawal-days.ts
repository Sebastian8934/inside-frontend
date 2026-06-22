"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWithdrawalDaysApi,
  type WithdrawalDayFilters,
} from "@/components/features/withdrawals/api/withdrawals.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useWithdrawalDays(filters: WithdrawalDayFilters) {
  return useQuery({
    queryKey: queryKeys.withdrawals.days(filters),
    queryFn: () => fetchWithdrawalDaysApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
