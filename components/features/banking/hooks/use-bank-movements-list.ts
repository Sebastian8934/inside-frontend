"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBankMovementsApi,
  type BankMovementFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useBankMovementsList(filters: BankMovementFilters) {
  return useQuery({
    queryKey: queryKeys.banking.movements(filters),
    queryFn: () => fetchBankMovementsApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
