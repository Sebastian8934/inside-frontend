"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchNegotiationDaysApi,
  type NegotiationDayFilters,
} from "@/components/features/negotiations/api/negotiations.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useNegotiationDays(filters: NegotiationDayFilters) {
  return useQuery({
    queryKey: queryKeys.negotiations.days(filters),
    queryFn: () => fetchNegotiationDaysApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
