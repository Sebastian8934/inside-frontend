"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOtcCounterparties } from "@/components/features/catalogs/otc-counterparties/api/otc-counterparties.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useOtcCounterpartiesList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.otcCounterparties.all({
      companyId,
      activeOnly: false,
    }),
    queryFn: () => fetchOtcCounterparties(companyId, false),
    enabled: Boolean(companyId),
  });
}
