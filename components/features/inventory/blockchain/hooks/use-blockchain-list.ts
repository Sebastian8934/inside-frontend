"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBlockchainTransactionsApi,
  type BlockchainFilters,
} from "@/components/features/inventory/blockchain/api/blockchain.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useBlockchainList(filters: BlockchainFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.blockchain.transactions(filters),
    queryFn: () => fetchBlockchainTransactionsApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
