import { axiosDelete } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  cashOutConceptDetailSchema,
  cashOutConceptsListSchema,
  cashOutExpenseDetailSchema,
  cashOutExpenseSummarySchema,
  cashOutExpensesListSchema,
  cashOutGroupDetailSchema,
  cashOutGroupsListSchema,
  cashOutTransactionCostSchema,
  cashOutTransactionCostsListSchema,
  paymentAccountDetailSchema,
  paymentAccountsListSchema,
  payrollEntriesListSchema,
  payrollEntrySchema,
} from "@/lib/validation/treasury.schema";
import type {
  CashOutConcept,
  CashOutConceptDetail,
  CashOutExpenseDetail,
  CashOutExpenseListItem,
  CashOutExpenseSummary,
  CashOutGroup,
  CashOutGroupDetail,
  CashOutTransactionCost,
  CreateCashOutConceptPayload,
  CreateCashOutExpensePayload,
  CreateCashOutGroupPayload,
  CreateCashOutTransactionCostPayload,
  CreatePaymentAccountPayload,
  CreatePayrollEntryPayload,
  PaymentAccount,
  PaymentAccountDetail,
  PayrollEntry,
  UpdateCashOutConceptPayload,
  UpdateCashOutExpensePayload,
  UpdateCashOutGroupPayload,
  UpdateCashOutTransactionCostPayload,
  UpdatePaymentAccountPayload,
  UpdatePayrollEntryPayload,
} from "@/types/cash-out";

export type CashOutExpenseFilters = {
  companyId?: number | null;
  periodMonth?: number;
  periodYear?: number;
  groupId?: number;
  conceptId?: number;
  paymentAccountId?: number;
  isReviewed?: boolean;
};

export type PayrollFilters = {
  companyId?: number | null;
  periodMonth?: number;
  periodYear?: number;
};

export type TransactionCostFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
};

export async function fetchCashOutGroups(
  companyId?: number | null,
  activeOnly = true,
): Promise<CashOutGroup[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.groups, { companyId, activeOnly }),
    cashOutGroupsListSchema,
    undefined,
    "Lista de grupos cash-out inválida.",
  );
}

export async function fetchCashOutConcepts(
  companyId?: number | null,
  groupId?: number,
  activeOnly = true,
): Promise<CashOutConcept[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.concepts, {
      companyId,
      groupId,
      activeOnly,
    }),
    cashOutConceptsListSchema,
    undefined,
    "Lista de conceptos cash-out inválida.",
  );
}

export async function fetchPaymentAccounts(
  companyId?: number | null,
  activeOnly = true,
): Promise<PaymentAccount[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.paymentAccounts, {
      companyId,
      activeOnly,
    }),
    paymentAccountsListSchema,
    undefined,
    "Lista de cuentas de pago inválida.",
  );
}

export async function createCashOutGroup(
  payload: CreateCashOutGroupPayload,
): Promise<CashOutGroupDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.groups,
    cashOutGroupDetailSchema,
    payload,
    undefined,
    "Grupo cash-out creado con respuesta inválida.",
  );
}

export async function updateCashOutGroup(
  id: number,
  payload: UpdateCashOutGroupPayload,
  companyId?: number | null,
): Promise<CashOutGroupDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.group(id), { companyId }),
    cashOutGroupDetailSchema,
    payload,
    undefined,
    "Grupo cash-out actualizado con respuesta inválida.",
  );
}

export async function createCashOutConcept(
  payload: CreateCashOutConceptPayload,
): Promise<CashOutConceptDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.concepts,
    cashOutConceptDetailSchema,
    payload,
    undefined,
    "Concepto cash-out creado con respuesta inválida.",
  );
}

export async function updateCashOutConcept(
  id: number,
  payload: UpdateCashOutConceptPayload,
  companyId?: number | null,
): Promise<CashOutConceptDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.concept(id), { companyId }),
    cashOutConceptDetailSchema,
    payload,
    undefined,
    "Concepto cash-out actualizado con respuesta inválida.",
  );
}

export async function createPaymentAccount(
  payload: CreatePaymentAccountPayload,
): Promise<PaymentAccountDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.paymentAccounts,
    paymentAccountDetailSchema,
    payload,
    undefined,
    "Cuenta de pago creada con respuesta inválida.",
  );
}

export async function updatePaymentAccount(
  id: number,
  payload: UpdatePaymentAccountPayload,
  companyId?: number | null,
): Promise<PaymentAccountDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.paymentAccount(id), { companyId }),
    paymentAccountDetailSchema,
    payload,
    undefined,
    "Cuenta de pago actualizada con respuesta inválida.",
  );
}

export async function fetchCashOutExpenses(
  filters: CashOutExpenseFilters = {},
): Promise<CashOutExpenseListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.expenses, filters),
    cashOutExpensesListSchema,
    undefined,
    "Lista de gastos cash-out inválida.",
  );
}

export async function fetchCashOutExpenseSummary(
  companyId?: number | null,
  periodMonth?: number,
  periodYear?: number,
): Promise<CashOutExpenseSummary> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.expenseSummary, {
      companyId,
      periodMonth,
      periodYear,
    }),
    cashOutExpenseSummarySchema,
    undefined,
    "Resumen de gastos cash-out inválido.",
  );
}

export async function createCashOutExpense(
  payload: CreateCashOutExpensePayload,
): Promise<CashOutExpenseDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.expenses,
    cashOutExpenseDetailSchema,
    payload,
    undefined,
    "Gasto cash-out creado con respuesta inválida.",
  );
}

export async function updateCashOutExpense(
  id: number,
  payload: UpdateCashOutExpensePayload,
  companyId?: number | null,
): Promise<CashOutExpenseDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.expense(id), { companyId }),
    cashOutExpenseDetailSchema,
    payload,
    undefined,
    "Gasto cash-out actualizado con respuesta inválida.",
  );
}

export async function markCashOutExpenseReviewed(
  id: number,
  companyId?: number | null,
): Promise<CashOutExpenseDetail> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.reviewExpense(id), { companyId }),
    cashOutExpenseDetailSchema,
    undefined,
    undefined,
    "Revisión de gasto cash-out con respuesta inválida.",
  );
}

export async function deleteCashOutExpense(
  id: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.expense(id), { companyId }),
  );
}

export async function fetchPayrollEntries(
  filters: PayrollFilters = {},
): Promise<PayrollEntry[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.payroll, filters),
    payrollEntriesListSchema,
    undefined,
    "Lista de nómina inválida.",
  );
}

export async function createPayrollEntry(
  payload: CreatePayrollEntryPayload,
): Promise<PayrollEntry> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.payroll,
    payrollEntrySchema,
    payload,
    undefined,
    "Entrada de nómina creada con respuesta inválida.",
  );
}

export async function updatePayrollEntry(
  id: number,
  payload: UpdatePayrollEntryPayload,
  companyId?: number | null,
): Promise<PayrollEntry> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.payrollEntry(id), { companyId }),
    payrollEntrySchema,
    payload,
    undefined,
    "Entrada de nómina actualizada con respuesta inválida.",
  );
}

export async function deletePayrollEntry(
  id: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.payrollEntry(id), { companyId }),
  );
}

export async function fetchTransactionCosts(
  filters: TransactionCostFilters = {},
): Promise<CashOutTransactionCost[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.transactionCosts, filters),
    cashOutTransactionCostsListSchema,
    undefined,
    "Lista de costos de transacción inválida.",
  );
}

export async function createTransactionCost(
  payload: CreateCashOutTransactionCostPayload,
): Promise<CashOutTransactionCost> {
  return axiosPostValidated(
    API_ENDPOINTS.cashOut.transactionCosts,
    cashOutTransactionCostSchema,
    payload,
    undefined,
    "Costo de transacción creado con respuesta inválida.",
  );
}

export async function updateTransactionCost(
  id: number,
  payload: UpdateCashOutTransactionCostPayload,
  companyId?: number | null,
): Promise<CashOutTransactionCost> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.cashOut.transactionCost(id), { companyId }),
    cashOutTransactionCostSchema,
    payload,
    undefined,
    "Costo de transacción actualizado con respuesta inválida.",
  );
}

export async function deleteTransactionCost(
  id: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.transactionCost(id), { companyId }),
  );
}
