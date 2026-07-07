"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchUsdtLoansApi,
  type UsdtLoanFilters,
} from "@/components/features/usdt-loans/api/usdt-loans.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useUsdtLoansList(
  filters: UsdtLoanFilters,
  enabled = true,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.usdtLoans.all(filters),
    queryFn: () => fetchUsdtLoansApi(filters),
    enabled: authReady && enabled && Boolean(filters.companyId),
  });
}
