export type BlockchainTransaction = {
  id: number;
  companyId: number;
  txHash: string;
  amountUsdt: number;
  matchStatus: string;
  usdtInventoryMovementId: number | null;
  movementOperationDate: string | null;
  movementClientCode: string | null;
  createdAt: string;
};

export type CreateBlockchainPayload = {
  txHash: string;
  amountUsdt: number;
  companyId?: number | null;
};

export type MatchBlockchainPayload = {
  usdtInventoryMovementId: number;
};
