"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchUsdtLoansApi,
  type UsdtLoanFilters,
} from "@/components/features/usdt-loans/api/usdt-loans.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useUsdtLoansList(
  filters: UsdtLoanFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.usdtLoans.all(filters),
    queryFn: () => fetchUsdtLoansApi(filters),
    enabled: enabled && Boolean(filters.companyId),
  });
}
