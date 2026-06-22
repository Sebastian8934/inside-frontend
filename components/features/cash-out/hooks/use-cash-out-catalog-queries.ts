"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCashOutConceptsApi,
  fetchCashOutGroupsApi,
  fetchPaymentAccountsApi,
} from "@/components/features/cash-out/api/cash-out.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useCashOutCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const isEnabled = enabled && Boolean(companyId);

  const groupsQuery = useQuery({
    queryKey: queryKeys.cashOut.groups({ companyId }),
    queryFn: () => fetchCashOutGroupsApi(companyId),
    enabled: isEnabled,
  });

  const conceptsQuery = useQuery({
    queryKey: queryKeys.cashOut.concepts({ companyId }),
    queryFn: () => fetchCashOutConceptsApi(companyId),
    enabled: isEnabled,
  });

  const paymentAccountsQuery = useQuery({
    queryKey: queryKeys.cashOut.paymentAccounts({ companyId }),
    queryFn: () => fetchPaymentAccountsApi(companyId),
    enabled: isEnabled,
  });

  return {
    groups: groupsQuery.data ?? [],
    concepts: conceptsQuery.data ?? [],
    paymentAccounts: paymentAccountsQuery.data ?? [],
    isLoading:
      groupsQuery.isLoading ||
      conceptsQuery.isLoading ||
      paymentAccountsQuery.isLoading,
  };
}
