"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchLiquidityClosesApi,
  type LiquidityCloseFilters,
} from "@/components/features/liquidity/api/liquidity.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useLiquidityCloses(filters: LiquidityCloseFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.liquidity.closes(filters),
    queryFn: () => fetchLiquidityClosesApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
