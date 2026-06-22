"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCommercialReps } from "@/components/features/catalogs/commercial-reps/api/commercial-reps.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useCommercialRepsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.commercialReps.all({ companyId, activeOnly: false }),
    queryFn: () => fetchCommercialReps(companyId, false),
    enabled: Boolean(companyId),
  });
}
