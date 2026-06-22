"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlatforms } from "@/components/features/catalogs/platforms/api/platforms.api";
import { queryKeys } from "@/lib/query/query-keys";

export function usePlatformsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.platforms.all({ companyId, activeOnly: false }),
    queryFn: () => fetchPlatforms(companyId, false),
    enabled: Boolean(companyId),
  });
}
