"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAccountHoldersApi,
  type AccountHolderFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useAccountHoldersList(filters: AccountHolderFilters) {
  return useQuery({
    queryKey: queryKeys.banking.accountHolders(filters),
    queryFn: () =>
      fetchAccountHoldersApi(filters.companyId, filters.activeOnly ?? true),
    enabled: Boolean(filters.companyId),
  });
}
