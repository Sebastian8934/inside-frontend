"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMovementClientsApi,
  fetchMovementCounterpartiesApi,
  fetchMovementWalletsApi,
} from "@/components/features/inventory/movements/api/movement-catalog.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useMovementCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const isEnabled = enabled && Boolean(companyId);

  const clientsQuery = useQuery({
    queryKey: queryKeys.inventory.movementsCatalog.clients(companyId),
    queryFn: () => fetchMovementClientsApi(companyId!),
    enabled: isEnabled,
  });

  const walletsQuery = useQuery({
    queryKey: queryKeys.inventory.movementsCatalog.wallets(companyId),
    queryFn: () => fetchMovementWalletsApi(companyId!),
    enabled: isEnabled,
  });

  const counterpartiesQuery = useQuery({
    queryKey: queryKeys.inventory.movementsCatalog.counterparties(companyId),
    queryFn: () => fetchMovementCounterpartiesApi(companyId!),
    enabled: isEnabled,
  });

  return {
    clients: clientsQuery.data ?? [],
    wallets: walletsQuery.data ?? [],
    counterparties: counterpartiesQuery.data ?? [],
    isLoading:
      clientsQuery.isLoading ||
      walletsQuery.isLoading ||
      counterpartiesQuery.isLoading,
  };
}
