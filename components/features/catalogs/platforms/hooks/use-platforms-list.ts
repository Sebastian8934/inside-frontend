"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlatforms } from "@/components/features/catalogs/platforms/api/platforms.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function usePlatformsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.platforms.all({ companyId, activeOnly: false }),
    queryFn: () => fetchPlatforms(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}
