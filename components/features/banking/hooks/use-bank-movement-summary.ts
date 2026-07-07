"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBankMovementSummaryApi,
  type BankSummaryFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useBankMovementSummary(filters: BankSummaryFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.banking.movementSummary(filters),
    queryFn: () => fetchBankMovementSummaryApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
