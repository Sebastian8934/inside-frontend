"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryClientsApi } from "@/components/features/delivery/api/delivery.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useDeliveryCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const isEnabled = enabled && Boolean(companyId);

  const clientsQuery = useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchDeliveryClientsApi(companyId!),
    enabled: isEnabled,
  });

  return {
    clients: clientsQuery.data ?? [],
    isLoading: clientsQuery.isLoading,
  };
}
