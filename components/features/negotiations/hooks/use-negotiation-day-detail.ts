"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNegotiationDayByIdApi } from "@/components/features/negotiations/api/negotiations.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useNegotiationDayDetail(
  dayId: number | undefined,
  companyId: number | null,
) {
  return useQuery({
    queryKey: queryKeys.negotiations.day(dayId ?? 0),
    queryFn: () => fetchNegotiationDayByIdApi(dayId!, companyId),
    enabled: Boolean(companyId && dayId),
  });
}
