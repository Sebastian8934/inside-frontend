import { axiosDelete } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  accountHolderDetailSchema,
  accountHolderSummaryListSchema,
  accountHoldersListSchema,
  bankMovementDetailSchema,
  bankMovementsListSchema,
} from "@/lib/validation/banking.schema";
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
): Promise<AccountHolder[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.banking.accountHolders, {
      companyId,
      activeOnly,
    }),
    accountHoldersListSchema,
    undefined,
    "Lista de titulares de cuenta inválida.",
  );
}

export async function createAccountHolder(
  payload: CreateAccountHolderPayload,
): Promise<AccountHolderDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.banking.accountHolders,
    accountHolderDetailSchema,
    payload,
    undefined,
    "Titular de cuenta creado con respuesta inválida.",
  );
}

export async function updateAccountHolder(
  id: number,
  payload: UpdateAccountHolderPayload,
  companyId?: number | null,
): Promise<AccountHolderDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.banking.accountHolder(id), { companyId }),
    accountHolderDetailSchema,
    payload,
    undefined,
    "Titular de cuenta actualizado con respuesta inválida.",
  );
}

export async function fetchBankMovements(
  filters: BankMovementFilters = {},
): Promise<BankMovementListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.banking.movements, filters),
    bankMovementsListSchema,
    undefined,
    "Lista de movimientos bancarios inválida.",
  );
}

export async function fetchBankMovementSummary(
  filters: BankSummaryFilters = {},
): Promise<AccountHolderSummary[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.banking.movementSummary, filters),
    accountHolderSummaryListSchema,
    undefined,
    "Resumen bancario inválido.",
  );
}

export async function createBankMovement(
  payload: CreateBankMovementPayload,
): Promise<BankMovementDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.banking.movements,
    bankMovementDetailSchema,
    payload,
    undefined,
    "Movimiento bancario creado con respuesta inválida.",
  );
}

export async function updateBankMovement(
  id: number,
  payload: UpdateBankMovementPayload,
  companyId?: number | null,
): Promise<BankMovementDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.banking.movement(id), { companyId }),
    bankMovementDetailSchema,
    payload,
    undefined,
    "Movimiento bancario actualizado con respuesta inválida.",
  );
}

export async function deleteBankMovement(
  id: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.banking.movement(id), { companyId }),
  );
}
