"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBankMovementsApi,
  type BankMovementFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useBankMovementsList(filters: BankMovementFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.banking.movements(filters),
    queryFn: () => fetchBankMovementsApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
