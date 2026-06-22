"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWithdrawalDayByIdApi } from "@/components/features/withdrawals/api/withdrawals.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useWithdrawalDayDetail(
  dayId: number | undefined,
  companyId: number | null,
) {
  return useQuery({
    queryKey: queryKeys.withdrawals.day(dayId ?? 0),
    queryFn: () => fetchWithdrawalDayByIdApi(dayId!, companyId),
    enabled: Boolean(companyId && dayId),
  });
}
