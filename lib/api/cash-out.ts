import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
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
) {
  return (
    (await axiosGet<CashOutGroup[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.groups, { companyId, activeOnly }),
    )) ?? []
  );
}

export async function fetchCashOutConcepts(
  companyId?: number | null,
  groupId?: number,
  activeOnly = true,
) {
  return (
    (await axiosGet<CashOutConcept[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.concepts, {
        companyId,
        groupId,
        activeOnly,
      }),
    )) ?? []
  );
}

export async function fetchPaymentAccounts(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<PaymentAccount[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.paymentAccounts, {
        companyId,
        activeOnly,
      }),
    )) ?? []
  );
}

export async function createCashOutGroup(payload: CreateCashOutGroupPayload) {
  return axiosPost<CashOutGroupDetail>(API_ENDPOINTS.cashOut.groups, payload);
}

export async function updateCashOutGroup(
  id: number,
  payload: UpdateCashOutGroupPayload,
  companyId?: number | null,
) {
  return axiosPut<CashOutGroupDetail>(
    buildApiUrl(API_ENDPOINTS.cashOut.group(id), { companyId }),
    payload,
  );
}

export async function createCashOutConcept(payload: CreateCashOutConceptPayload) {
  return axiosPost<CashOutConceptDetail>(
    API_ENDPOINTS.cashOut.concepts,
    payload,
  );
}

export async function updateCashOutConcept(
  id: number,
  payload: UpdateCashOutConceptPayload,
  companyId?: number | null,
) {
  return axiosPut<CashOutConceptDetail>(
    buildApiUrl(API_ENDPOINTS.cashOut.concept(id), { companyId }),
    payload,
  );
}

export async function createPaymentAccount(payload: CreatePaymentAccountPayload) {
  return axiosPost<PaymentAccountDetail>(
    API_ENDPOINTS.cashOut.paymentAccounts,
    payload,
  );
}

export async function updatePaymentAccount(
  id: number,
  payload: UpdatePaymentAccountPayload,
  companyId?: number | null,
) {
  return axiosPut<PaymentAccountDetail>(
    buildApiUrl(API_ENDPOINTS.cashOut.paymentAccount(id), { companyId }),
    payload,
  );
}

export async function fetchCashOutExpenses(filters: CashOutExpenseFilters = {}) {
  return (
    (await axiosGet<CashOutExpenseListItem[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.expenses, filters),
    )) ?? []
  );
}

export async function fetchCashOutExpenseSummary(
  companyId?: number | null,
  periodMonth?: number,
  periodYear?: number,
) {
  return axiosGet<CashOutExpenseSummary>(
    buildApiUrl(API_ENDPOINTS.cashOut.expenseSummary, {
      companyId,
      periodMonth,
      periodYear,
    }),
  );
}

export async function createCashOutExpense(payload: CreateCashOutExpensePayload) {
  return axiosPost<CashOutExpenseDetail>(
    API_ENDPOINTS.cashOut.expenses,
    payload,
  );
}

export async function updateCashOutExpense(
  id: number,
  payload: UpdateCashOutExpensePayload,
  companyId?: number | null,
) {
  return axiosPut<CashOutExpenseDetail>(
    buildApiUrl(API_ENDPOINTS.cashOut.expense(id), { companyId }),
    payload,
  );
}

export async function markCashOutExpenseReviewed(
  id: number,
  companyId?: number | null,
) {
  return axiosPost<CashOutExpenseDetail>(
    buildApiUrl(API_ENDPOINTS.cashOut.reviewExpense(id), { companyId }),
  );
}

export async function deleteCashOutExpense(
  id: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.expense(id), { companyId }),
  );
}

export async function fetchPayrollEntries(filters: PayrollFilters = {}) {
  return (
    (await axiosGet<PayrollEntry[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.payroll, filters),
    )) ?? []
  );
}

export async function createPayrollEntry(payload: CreatePayrollEntryPayload) {
  return axiosPost<PayrollEntry>(API_ENDPOINTS.cashOut.payroll, payload);
}

export async function updatePayrollEntry(
  id: number,
  payload: UpdatePayrollEntryPayload,
  companyId?: number | null,
) {
  return axiosPut<PayrollEntry>(
    buildApiUrl(API_ENDPOINTS.cashOut.payrollEntry(id), { companyId }),
    payload,
  );
}

export async function deletePayrollEntry(
  id: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.payrollEntry(id), { companyId }),
  );
}

export async function fetchTransactionCosts(
  filters: TransactionCostFilters = {},
) {
  return (
    (await axiosGet<CashOutTransactionCost[]>(
      buildApiUrl(API_ENDPOINTS.cashOut.transactionCosts, filters),
    )) ?? []
  );
}

export async function createTransactionCost(
  payload: CreateCashOutTransactionCostPayload,
) {
  return axiosPost<CashOutTransactionCost>(
    API_ENDPOINTS.cashOut.transactionCosts,
    payload,
  );
}

export async function updateTransactionCost(
  id: number,
  payload: UpdateCashOutTransactionCostPayload,
  companyId?: number | null,
) {
  return axiosPut<CashOutTransactionCost>(
    buildApiUrl(API_ENDPOINTS.cashOut.transactionCost(id), { companyId }),
    payload,
  );
}

export async function deleteTransactionCost(
  id: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.cashOut.transactionCost(id), { companyId }),
  );
}
