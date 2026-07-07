"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCashOutExpensesApi,
  fetchCashOutExpenseSummaryApi,
} from "@/components/features/cash-out/api/cash-out.api";
import type { CashOutExpenseFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useCashOutExpensesList(filters: CashOutExpenseFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.expenses(filters),
    queryFn: () => fetchCashOutExpensesApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}

export function useCashOutExpenseSummary(
  companyId: number | null,
  periodMonth: number,
  periodYear: number,
) {
  const authReady = useAuthQueryEnabled();
  const filters = { companyId, periodMonth, periodYear };

  return useQuery({
    queryKey: queryKeys.cashOut.expenseSummary(filters),
    queryFn: () =>
      fetchCashOutExpenseSummaryApi(companyId, periodMonth, periodYear),
    enabled: authReady && Boolean(companyId),
  });
}
