"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchNegotiationCommercialRepsApi,
  fetchNegotiationCounterpartiesApi,
  fetchNegotiationPlatformsApi,
} from "@/components/features/negotiations/api/negotiation-catalog.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useNegotiationCatalogQueries(
  companyId: number | null,
  enabled = true,
) {
  const isEnabled = enabled && Boolean(companyId);

  const platformsQuery = useQuery({
    queryKey: queryKeys.negotiations.catalog.platforms(companyId),
    queryFn: () => fetchNegotiationPlatformsApi(companyId!),
    enabled: isEnabled,
  });

  const commercialRepsQuery = useQuery({
    queryKey: queryKeys.negotiations.catalog.commercialReps(companyId),
    queryFn: () => fetchNegotiationCommercialRepsApi(companyId!),
    enabled: isEnabled,
  });

  const counterpartiesQuery = useQuery({
    queryKey: queryKeys.negotiations.catalog.counterparties(companyId),
    queryFn: () => fetchNegotiationCounterpartiesApi(companyId!),
    enabled: isEnabled,
  });

  return {
    platforms: platformsQuery.data ?? [],
    commercialReps: commercialRepsQuery.data ?? [],
    counterparties: counterpartiesQuery.data ?? [],
    isLoading:
      platformsQuery.isLoading ||
      commercialRepsQuery.isLoading ||
      counterpartiesQuery.isLoading,
  };
}
