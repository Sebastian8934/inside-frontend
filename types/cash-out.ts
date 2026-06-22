export type CashOutGroup = {
  id: number;
  companyId: number;
  name: string;
  isActive: boolean;
};

export type CashOutConcept = {
  id: number;
  companyId: number;
  groupId: number;
  groupName: string;
  name: string;
  isActive: boolean;
};

export type PaymentAccount = {
  id: number;
  companyId: number;
  name: string;
  isActive: boolean;
};

export type CashOutGroupDetail = {
  id: number;
  companyId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type CashOutConceptDetail = {
  id: number;
  companyId: number;
  groupId: number;
  groupName: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type PaymentAccountDetail = PaymentAccount & {
  createdAt: string;
  updatedAt: string | null;
};

export type CreateCashOutGroupPayload = {
  name: string;
  companyId?: number | null;
};

export type UpdateCashOutGroupPayload = {
  name: string;
  isActive: boolean;
};

export type CreateCashOutConceptPayload = {
  groupId: number;
  name: string;
  companyId?: number | null;
};

export type UpdateCashOutConceptPayload = {
  groupId: number;
  name: string;
  isActive: boolean;
};

export type CreatePaymentAccountPayload = {
  name: string;
  companyId?: number | null;
};

export type UpdatePaymentAccountPayload = {
  name: string;
  isActive: boolean;
};

export type CashOutExpenseListItem = {
  id: number;
  companyId: number;
  expenseDate: string;
  groupId: number;
  groupName: string;
  conceptId: number;
  conceptName: string;
  description: string;
  paymentAccountId: number;
  paymentAccountName: string;
  amountCop: number;
  expenseType: string | null;
  isReviewed: boolean;
  periodMonth: number;
  periodYear: number;
  createdAt: string;
};

export type CashOutExpenseDetail = CashOutExpenseListItem & {
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  createdByUserId: string | null;
  updatedAt: string | null;
};

export type CashOutExpenseSummary = {
  companyId: number;
  periodMonth: number;
  periodYear: number;
  totalAmountCop: number;
  unreviewedCount: number;
  topConceptName: string | null;
};

export type CreateCashOutExpensePayload = {
  expenseDate: string;
  groupId: number;
  conceptId: number;
  description: string;
  paymentAccountId: number;
  amountCop: number;
  expenseType?: string | null;
  companyId?: number | null;
};

export type UpdateCashOutExpensePayload = {
  expenseDate: string;
  groupId: number;
  conceptId: number;
  description: string;
  paymentAccountId: number;
  amountCop: number;
  expenseType?: string | null;
};

export type PayrollEntry = {
  id: number;
  companyId: number;
  periodMonth: number;
  periodYear: number;
  employeeName: string;
  jobTitle: string;
  baseSalaryCop: number;
  bonusCop: number;
  totalCop: number;
  createdAt: string;
};

export type CreatePayrollEntryPayload = {
  periodMonth: number;
  periodYear: number;
  employeeName: string;
  jobTitle: string;
  baseSalaryCop: number;
  bonusCop?: number;
  companyId?: number | null;
};

export type UpdatePayrollEntryPayload = {
  periodMonth: number;
  periodYear: number;
  employeeName: string;
  jobTitle: string;
  baseSalaryCop: number;
  bonusCop?: number;
};

export type CashOutTransactionCost = {
  id: number;
  companyId: number;
  costDate: string;
  operationalGroup: string | null;
  description: string | null;
  amountCop: number | null;
  costPercentage: number | null;
  comment: string | null;
  createdAt: string;
};

export type CreateCashOutTransactionCostPayload = {
  costDate: string;
  operationalGroup?: string | null;
  description?: string | null;
  amountCop?: number | null;
  costPercentage?: number | null;
  comment?: string | null;
  companyId?: number | null;
};

export type UpdateCashOutTransactionCostPayload = {
  costDate: string;
  operationalGroup?: string | null;
  description?: string | null;
  amountCop?: number | null;
  costPercentage?: number | null;
  comment?: string | null;
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
