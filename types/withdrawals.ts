export type WithdrawalCompany = {
  id: number;
  companyId: number;
  name: string;
  isActive: boolean;
};

export type WithdrawalSlot = {
  slotIndex: number;
  amountCop: number;
  isActive: boolean;
};

export type WithdrawalCompanyLine = {
  withdrawalCompanyId: number;
  withdrawalCompanyName: string;
  clientId: number | null;
  clientCode: string | null;
  slots: WithdrawalSlot[];
  totalCop: number;
};

export type WithdrawalTransfer = {
  id: number;
  withdrawalCompanyId: number;
  withdrawalCompanyName: string;
  amountCop: number;
  transferType: string;
};

export type WithdrawalDayListItem = {
  id: number;
  companyId: number;
  operationDate: string;
  totalWithdrawalsCop: number;
  totalTransfersCop: number;
  lineCount: number;
  transferCount: number;
  createdAt: string;
};

export type WithdrawalDayDetail = {
  id: number;
  companyId: number;
  operationDate: string;
  totalWithdrawalsCop: number;
  totalTransfersCop: number;
  createdAt: string;
  updatedAt: string | null;
  companyLines: WithdrawalCompanyLine[];
  transfers: WithdrawalTransfer[];
};

export type WithdrawalConsolidatedItem = {
  id: number;
  companyId: number;
  operationDate: string;
  withdrawalCompanyId: number;
  withdrawalCompanyName: string;
  amountCop: number;
  holding: string | null;
  periodMonth: number;
  periodYear: number;
};

export type UpsertWithdrawalCompanyLinePayload = {
  withdrawalCompanyId: number;
  clientId: number | null;
  slots: WithdrawalSlot[];
};

export type CreateWithdrawalTransferPayload = {
  withdrawalCompanyId: number;
  amountCop: number;
  transferType: string;
};

export type UpdateWithdrawalTransferPayload = CreateWithdrawalTransferPayload;

export type CreateWithdrawalConsolidatedPayload = {
  operationDate: string;
  withdrawalCompanyId: number;
  amountCop: number;
  holding?: string | null;
  periodMonth?: number;
  periodYear?: number;
  companyId?: number | null;
};

export type UpdateWithdrawalConsolidatedPayload = {
  operationDate: string;
  withdrawalCompanyId: number;
  amountCop: number;
  holding?: string | null;
  periodMonth: number;
  periodYear: number;
};

export const WITHDRAWAL_TRANSFER_TYPES = [
  "PAGO",
  "CONSIGNACION",
  "TRANSFERENCIA",
] as const;

export type WithdrawalTransferType =
  (typeof WITHDRAWAL_TRANSFER_TYPES)[number];

export function emptyWithdrawalSlots(): WithdrawalSlot[] {
  return Array.from({ length: 10 }, (_, index) => ({
    slotIndex: index + 1,
    amountCop: 0,
    isActive: false,
  }));
}
