import { axiosGet, axiosPost } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  BlockchainTransaction,
  CreateBlockchainPayload,
  MatchBlockchainPayload,
} from "@/types/blockchain";

export type BlockchainFilters = {
  companyId?: number | null;
  matchStatus?: string;
  txHash?: string;
};

export async function fetchBlockchainTransactions(
  filters: BlockchainFilters = {},
) {
  return (
    (await axiosGet<BlockchainTransaction[]>(
      buildApiUrl(API_ENDPOINTS.blockchain.transactions, filters),
    )) ?? []
  );
}

export async function createBlockchainTransaction(
  payload: CreateBlockchainPayload,
) {
  return axiosPost<BlockchainTransaction>(
    API_ENDPOINTS.blockchain.transactions,
    payload,
  );
}

export async function matchBlockchainTransaction(
  id: number,
  payload: MatchBlockchainPayload,
  companyId?: number | null,
) {
  return axiosPost<BlockchainTransaction>(
    buildApiUrl(API_ENDPOINTS.blockchain.match(id), { companyId }),
    payload,
  );
}

export async function unmatchBlockchainTransaction(
  id: number,
  companyId?: number | null,
) {
  return axiosPost<BlockchainTransaction>(
    buildApiUrl(API_ENDPOINTS.blockchain.unmatch(id), { companyId }),
  );
}
