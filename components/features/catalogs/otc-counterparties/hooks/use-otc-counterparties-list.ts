"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOtcCounterparties } from "@/components/features/catalogs/otc-counterparties/api/otc-counterparties.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useOtcCounterpartiesList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.otcCounterparties.all({
      companyId,
      activeOnly: false,
    }),
    queryFn: () => fetchOtcCounterparties(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}
