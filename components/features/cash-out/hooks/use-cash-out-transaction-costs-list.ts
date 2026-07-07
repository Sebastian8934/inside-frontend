"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactionCostsApi } from "@/components/features/cash-out/api/cash-out.api";
import type { TransactionCostFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useCashOutTransactionCostsList(
  filters: TransactionCostFilters,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.transactionCosts(filters),
    queryFn: () => fetchTransactionCostsApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
