export type InventoryMovement = {
  id: number;
  companyId: number;
  operationDate: string;
  usdtAmount: number;
  purchaseRate: number | null;
  totalCop: number | null;
  movementType: string;
  clientId: number;
  clientCode: string;
  clientName: string;
  usesCobre: boolean;
  shipmentNumber: string | null;
  txHash: string | null;
  whatsappGroup: string | null;
  otcCounterpartyId: number | null;
  otcCounterpartyCode: string | null;
  walletId: number | null;
  walletCode: string | null;
};

export type OtcSummaryItem = {
  companyId: number;
  operationDate: string;
  otcCounterpartyId: number;
  otcCounterpartyCode: string;
  otcCounterpartyName: string;
  dispersadoCop: number;
  cobroCop: number;
  utilidadCop: number;
  saldoUsdt: number;
};

export type CreateMovementPayload = {
  operationDate: string;
  usdtAmount: number;
  movementType: string;
  clientId: number;
  purchaseRate?: number | null;
  totalCop?: number | null;
  usesCobre?: boolean;
  shipmentNumber?: string | null;
  txHash?: string | null;
  whatsappGroup?: string | null;
  otcCounterpartyId?: number | null;
  walletId?: number | null;
  companyId?: number | null;
};

export type UpdateMovementPayload = Omit<
  CreateMovementPayload,
  "companyId"
>;

export const MOVEMENT_TYPES = ["Efectivo", "Cuenta"] as const;
