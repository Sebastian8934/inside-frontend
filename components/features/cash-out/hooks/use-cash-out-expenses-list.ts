"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCashOutExpensesApi,
  fetchCashOutExpenseSummaryApi,
} from "@/components/features/cash-out/api/cash-out.api";
import type { CashOutExpenseFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";

export function useCashOutExpensesList(filters: CashOutExpenseFilters) {
  return useQuery({
    queryKey: queryKeys.cashOut.expenses(filters),
    queryFn: () => fetchCashOutExpensesApi(filters),
    enabled: Boolean(filters.companyId),
  });
}

export function useCashOutExpenseSummary(
  companyId: number | null,
  periodMonth: number,
  periodYear: number,
) {
  const filters = { companyId, periodMonth, periodYear };

  return useQuery({
    queryKey: queryKeys.cashOut.expenseSummary(filters),
    queryFn: () =>
      fetchCashOutExpenseSummaryApi(companyId, periodMonth, periodYear),
    enabled: Boolean(companyId),
  });
}
