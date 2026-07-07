"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCashOutConcepts,
  fetchCashOutGroups,
  fetchPaymentAccounts,
} from "@/components/features/catalogs/cash-out-catalog/api/cash-out-catalog.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

const catalogFilters = (companyId: number | null) => ({
  companyId,
  activeOnly: false,
});

export function useCashOutGroupsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.groups(catalogFilters(companyId)),
    queryFn: () => fetchCashOutGroups(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}

export function useCashOutConceptsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.concepts(catalogFilters(companyId)),
    queryFn: () => fetchCashOutConcepts(companyId, undefined, false),
    enabled: authReady && Boolean(companyId),
  });
}

export function usePaymentAccountsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.paymentAccounts(catalogFilters(companyId)),
    queryFn: () => fetchPaymentAccounts(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}
