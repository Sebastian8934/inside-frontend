"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBlockchainTransactionsApi,
  type BlockchainFilters,
} from "@/components/features/inventory/blockchain/api/blockchain.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useBlockchainList(filters: BlockchainFilters) {
  return useQuery({
    queryKey: queryKeys.blockchain.transactions(filters),
    queryFn: () => fetchBlockchainTransactionsApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
