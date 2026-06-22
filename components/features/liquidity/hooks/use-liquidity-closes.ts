"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchLiquidityClosesApi,
  type LiquidityCloseFilters,
} from "@/components/features/liquidity/api/liquidity.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useLiquidityCloses(filters: LiquidityCloseFilters) {
  return useQuery({
    queryKey: queryKeys.liquidity.closes(filters),
    queryFn: () => fetchLiquidityClosesApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
