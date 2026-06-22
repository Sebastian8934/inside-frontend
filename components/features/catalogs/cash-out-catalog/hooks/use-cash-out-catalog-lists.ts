"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCashOutConcepts,
  fetchCashOutGroups,
  fetchPaymentAccounts,
} from "@/components/features/catalogs/cash-out-catalog/api/cash-out-catalog.api";
import { queryKeys } from "@/lib/query/query-keys";

const catalogFilters = (companyId: number | null) => ({
  companyId,
  activeOnly: false,
});

export function useCashOutGroupsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.cashOut.groups(catalogFilters(companyId)),
    queryFn: () => fetchCashOutGroups(companyId, false),
    enabled: Boolean(companyId),
  });
}

export function useCashOutConceptsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.cashOut.concepts(catalogFilters(companyId)),
    queryFn: () => fetchCashOutConcepts(companyId, undefined, false),
    enabled: Boolean(companyId),
  });
}

export function usePaymentAccountsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.cashOut.paymentAccounts(catalogFilters(companyId)),
    queryFn: () => fetchPaymentAccounts(companyId, false),
    enabled: Boolean(companyId),
  });
}
