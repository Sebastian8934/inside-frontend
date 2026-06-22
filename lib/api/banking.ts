import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AccountHolder,
  AccountHolderDetail,
  AccountHolderSummary,
  BankMovementDetail,
  BankMovementListItem,
  CreateAccountHolderPayload,
  CreateBankMovementPayload,
  UpdateAccountHolderPayload,
  UpdateBankMovementPayload,
} from "@/types/banking";

export type AccountHolderFilters = {
  companyId?: number | null;
  activeOnly?: boolean;
};

export type BankMovementFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  accountHolderId?: number;
  periodMonth?: number;
  periodYear?: number;
};

export type BankSummaryFilters = {
  companyId?: number | null;
  periodMonth?: number;
  periodYear?: number;
};

export async function fetchAccountHolders(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<AccountHolder[]>(
      buildApiUrl(API_ENDPOINTS.banking.accountHolders, {
        companyId,
        activeOnly,
      }),
    )) ?? []
  );
}

export async function createAccountHolder(payload: CreateAccountHolderPayload) {
  return axiosPost<AccountHolderDetail>(
    API_ENDPOINTS.banking.accountHolders,
    payload,
  );
}

export async function updateAccountHolder(
  id: number,
  payload: UpdateAccountHolderPayload,
  companyId?: number | null,
) {
  return axiosPut<AccountHolderDetail>(
    buildApiUrl(API_ENDPOINTS.banking.accountHolder(id), { companyId }),
    payload,
  );
}

export async function fetchBankMovements(filters: BankMovementFilters = {}) {
  return (
    (await axiosGet<BankMovementListItem[]>(
      buildApiUrl(API_ENDPOINTS.banking.movements, filters),
    )) ?? []
  );
}

export async function fetchBankMovementSummary(
  filters: BankSummaryFilters = {},
) {
  return (
    (await axiosGet<AccountHolderSummary[]>(
      buildApiUrl(API_ENDPOINTS.banking.movementSummary, filters),
    )) ?? []
  );
}

export async function createBankMovement(payload: CreateBankMovementPayload) {
  return axiosPost<BankMovementDetail>(
    API_ENDPOINTS.banking.movements,
    payload,
  );
}

export async function updateBankMovement(
  id: number,
  payload: UpdateBankMovementPayload,
  companyId?: number | null,
) {
  return axiosPut<BankMovementDetail>(
    buildApiUrl(API_ENDPOINTS.banking.movement(id), { companyId }),
    payload,
  );
}

export async function deleteBankMovement(
  id: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.banking.movement(id), { companyId }),
  );
}
