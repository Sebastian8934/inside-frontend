"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNegotiationDayByIdApi } from "@/components/features/negotiations/api/negotiations.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useNegotiationDayDetail(
  dayId: number | undefined,
  companyId: number | null,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.negotiations.day(dayId ?? 0),
    queryFn: () => fetchNegotiationDayByIdApi(dayId!, companyId),
    enabled: authReady && Boolean(companyId && dayId),
  });
}
