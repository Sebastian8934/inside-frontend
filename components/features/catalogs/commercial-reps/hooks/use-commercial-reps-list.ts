"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCommercialReps } from "@/components/features/catalogs/commercial-reps/api/commercial-reps.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useCommercialRepsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.commercialReps.all({ companyId, activeOnly: false }),
    queryFn: () => fetchCommercialReps(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}
