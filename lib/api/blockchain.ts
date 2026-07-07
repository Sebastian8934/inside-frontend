import {
  axiosGetValidated,
  axiosPostValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  blockchainTransactionSchema,
  blockchainTransactionsListSchema,
} from "@/lib/validation/operations.schema";
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
): Promise<BlockchainTransaction[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.blockchain.transactions, filters),
    blockchainTransactionsListSchema,
    undefined,
    "Lista de transacciones blockchain inválida.",
  );
}

export async function createBlockchainTransaction(
  payload: CreateBlockchainPayload,
): Promise<BlockchainTransaction> {
  return axiosPostValidated(
    API_ENDPOINTS.blockchain.transactions,
    blockchainTransactionSchema,
    payload,
    undefined,
    "Transacción blockchain creada con respuesta inválida.",
  );
}

export async function matchBlockchainTransaction(
  id: number,
  payload: MatchBlockchainPayload,
  companyId?: number | null,
): Promise<BlockchainTransaction> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.blockchain.match(id), { companyId }),
    blockchainTransactionSchema,
    payload,
    undefined,
    "Match blockchain con respuesta inválida.",
  );
}

export async function unmatchBlockchainTransaction(
  id: number,
  companyId?: number | null,
): Promise<BlockchainTransaction> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.blockchain.unmatch(id), { companyId }),
    blockchainTransactionSchema,
    undefined,
    undefined,
    "Unmatch blockchain con respuesta inválida.",
  );
}
