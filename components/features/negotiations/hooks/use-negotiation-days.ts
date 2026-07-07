"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchNegotiationDaysApi,
  type NegotiationDayFilters,
} from "@/components/features/negotiations/api/negotiations.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useNegotiationDays(filters: NegotiationDayFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.negotiations.days(filters),
    queryFn: () => fetchNegotiationDaysApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
