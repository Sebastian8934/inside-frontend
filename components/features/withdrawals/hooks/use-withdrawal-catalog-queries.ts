"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchWithdrawalClientsApi,
  fetchWithdrawalCompaniesApi,
} from "@/components/features/withdrawals/api/withdrawals.api";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

export function useWithdrawalCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const authReady = useAuthQueryEnabled();
  const isEnabled = authReady && enabled && Boolean(companyId);

  const companiesQuery = useQuery({
    queryKey: queryKeys.withdrawals.companies({ companyId }),
    queryFn: () => fetchWithdrawalCompaniesApi(companyId),
    enabled: isEnabled,
  });

  const clientsQuery = useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchWithdrawalClientsApi(companyId!),
    enabled: isEnabled,
  });

  return {
    companies: companiesQuery.data ?? [],
    clients: clientsQuery.data ?? [],
    isLoading: companiesQuery.isLoading || clientsQuery.isLoading,
  };
}
