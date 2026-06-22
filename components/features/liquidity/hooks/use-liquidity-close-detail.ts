"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLiquidityCloseByIdApi } from "@/components/features/liquidity/api/liquidity.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useLiquidityCloseDetail(
  closeId: number | undefined,
  companyId: number | null,
) {
  return useQuery({
    queryKey: queryKeys.liquidity.close(closeId ?? 0),
    queryFn: () => fetchLiquidityCloseByIdApi(closeId!, companyId),
    enabled: Boolean(companyId && closeId),
  });
}
