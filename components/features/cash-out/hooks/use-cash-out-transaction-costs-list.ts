"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactionCostsApi } from "@/components/features/cash-out/api/cash-out.api";
import type { TransactionCostFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";

export function useCashOutTransactionCostsList(
  filters: TransactionCostFilters,
) {
  return useQuery({
    queryKey: queryKeys.cashOut.transactionCosts(filters),
    queryFn: () => fetchTransactionCostsApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
