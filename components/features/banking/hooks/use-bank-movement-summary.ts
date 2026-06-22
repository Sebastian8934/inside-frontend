"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBankMovementSummaryApi,
  type BankSummaryFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useBankMovementSummary(filters: BankSummaryFilters) {
  return useQuery({
    queryKey: queryKeys.banking.movementSummary(filters),
    queryFn: () => fetchBankMovementSummaryApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
