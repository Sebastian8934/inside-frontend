export type AccountHolder = {
  id: number;
  companyId: number;
  name: string;
  isActive: boolean;
};

export type AccountHolderDetail = AccountHolder & {
  createdAt: string;
  updatedAt: string | null;
};

export type CreateAccountHolderPayload = {
  name: string;
  companyId?: number | null;
};

export type UpdateAccountHolderPayload = {
  name: string;
  isActive: boolean;
};

export type BankMovementListItem = {
  id: number;
  companyId: number;
  movementDate: string;
  amountCop: number;
  concept: string;
  accountHolderId: number;
  accountHolderName: string;
  periodMonth: number;
  periodYear: number;
  createdAt: string;
};

export type BankMovementDetail = BankMovementListItem & {
  createdByUserId: string | null;
  updatedAt: string | null;
};

export type CreateBankMovementPayload = {
  movementDate: string;
  amountCop: number;
  concept: string;
  accountHolderId: number;
  periodMonth?: number;
  periodYear?: number;
  companyId?: number | null;
};

export type UpdateBankMovementPayload = {
  movementDate: string;
  amountCop: number;
  concept: string;
  accountHolderId: number;
  periodMonth: number;
  periodYear: number;
};

export type AccountHolderSummary = {
  companyId: number;
  accountHolderId: number;
  accountHolderName: string;
  periodYear: number;
  periodMonth: number;
  abonos: number;
  egresos: number;
  disponible: number;
};

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export function getPeriodFromDate(date: Date) {
  return {
    periodMonth: date.getMonth() + 1,
    periodYear: date.getFullYear(),
  };
}
