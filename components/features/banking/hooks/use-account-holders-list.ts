"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAccountHoldersApi,
  type AccountHolderFilters,
} from "@/components/features/banking/api/banking.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useAccountHoldersList(filters: AccountHolderFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.banking.accountHolders(filters),
    queryFn: () =>
      fetchAccountHoldersApi(filters.companyId, filters.activeOnly ?? true),
    enabled: authReady && Boolean(filters.companyId),
  });
}
