"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsdtLoanClientsApi } from "@/components/features/usdt-loans/api/usdt-loans.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useUsdtLoanCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const isEnabled = enabled && Boolean(companyId);

  const clientsQuery = useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchUsdtLoanClientsApi(companyId!),
    enabled: isEnabled,
  });

  return {
    clients: clientsQuery.data ?? [],
    isLoading: clientsQuery.isLoading,
  };
}
