import { axiosDelete } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  withdrawalCompaniesListSchema,
  withdrawalCompanyDetailSchema,
  withdrawalConsolidatedItemSchema,
  withdrawalConsolidatedListSchema,
  withdrawalDayDetailSchema,
  withdrawalDaysListSchema,
  withdrawalTransferSchema,
} from "@/lib/validation/treasury.schema";
import type {
  CreateWithdrawalCompanyPayload,
  CreateWithdrawalConsolidatedPayload,
  CreateWithdrawalTransferPayload,
  UpdateWithdrawalCompanyPayload,
  UpdateWithdrawalConsolidatedPayload,
  UpdateWithdrawalTransferPayload,
  UpsertWithdrawalCompanyLinePayload,
  WithdrawalCompany,
  WithdrawalCompanyDetail,
  WithdrawalConsolidatedItem,
  WithdrawalDayDetail,
  WithdrawalDayListItem,
  WithdrawalTransfer,
} from "@/types/withdrawals";

export type WithdrawalDayFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
};

export type WithdrawalConsolidatedFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  periodMonth?: number;
  periodYear?: number;
  holding?: string;
};

export async function fetchWithdrawalCompanies(
  companyId?: number | null,
  activeOnly = true,
): Promise<WithdrawalCompany[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.companies, {
      companyId,
      activeOnly,
    }),
    withdrawalCompaniesListSchema,
    undefined,
    "Lista de empresas de retiro inválida.",
  );
}

export async function createWithdrawalCompany(
  payload: CreateWithdrawalCompanyPayload,
): Promise<WithdrawalCompanyDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.withdrawals.companies,
    withdrawalCompanyDetailSchema,
    payload,
    undefined,
    "Empresa de retiro creada con respuesta inválida.",
  );
}

export async function updateWithdrawalCompany(
  id: number,
  payload: UpdateWithdrawalCompanyPayload,
  companyId?: number | null,
): Promise<WithdrawalCompanyDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.company(id), { companyId }),
    withdrawalCompanyDetailSchema,
    payload,
    undefined,
    "Empresa de retiro actualizada con respuesta inválida.",
  );
}

export async function fetchWithdrawalDays(
  filters: WithdrawalDayFilters = {},
): Promise<WithdrawalDayListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.days, filters),
    withdrawalDaysListSchema,
    undefined,
    "Lista de días de retiro inválida.",
  );
}

export async function fetchWithdrawalDayById(
  id: number,
  companyId?: number | null,
): Promise<WithdrawalDayDetail> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.day(id), { companyId }),
    withdrawalDayDetailSchema,
    undefined,
    "Detalle de día de retiro inválido.",
  );
}

export async function createWithdrawalDay(
  operationDate: string,
  companyId?: number | null,
): Promise<WithdrawalDayDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.withdrawals.days,
    withdrawalDayDetailSchema,
    { operationDate, companyId },
    undefined,
    "Día de retiro creado con respuesta inválida.",
  );
}

export async function upsertWithdrawalCompanyLine(
  dayId: number,
  payload: UpsertWithdrawalCompanyLinePayload,
  companyId?: number | null,
): Promise<WithdrawalDayDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.companyLines(dayId), { companyId }),
    withdrawalDayDetailSchema,
    payload,
    undefined,
    "Línea de retiro guardada con respuesta inválida.",
  );
}

export async function createWithdrawalTransfer(
  dayId: number,
  payload: CreateWithdrawalTransferPayload,
  companyId?: number | null,
): Promise<WithdrawalTransfer> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.dayTransfers(dayId), { companyId }),
    withdrawalTransferSchema,
    payload,
    undefined,
    "Transferencia de retiro creada con respuesta inválida.",
  );
}

export async function updateWithdrawalTransfer(
  transferId: number,
  payload: UpdateWithdrawalTransferPayload,
  companyId?: number | null,
): Promise<WithdrawalTransfer> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.transfer(transferId), { companyId }),
    withdrawalTransferSchema,
    payload,
    undefined,
    "Transferencia de retiro actualizada con respuesta inválida.",
  );
}

export async function deleteWithdrawalTransfer(
  transferId: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.withdrawals.transfer(transferId), { companyId }),
  );
}

export async function fetchWithdrawalConsolidated(
  filters: WithdrawalConsolidatedFilters = {},
): Promise<WithdrawalConsolidatedItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.consolidated, filters),
    withdrawalConsolidatedListSchema,
    undefined,
    "Lista consolidada de retiros inválida.",
  );
}

export async function createWithdrawalConsolidated(
  payload: CreateWithdrawalConsolidatedPayload,
): Promise<WithdrawalConsolidatedItem> {
  return axiosPostValidated(
    API_ENDPOINTS.withdrawals.consolidated,
    withdrawalConsolidatedItemSchema,
    payload,
    undefined,
    "Retiro consolidado creado con respuesta inválida.",
  );
}

export async function updateWithdrawalConsolidated(
  id: number,
  payload: UpdateWithdrawalConsolidatedPayload,
  companyId?: number | null,
): Promise<WithdrawalConsolidatedItem> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.withdrawals.consolidatedItem(id), { companyId }),
    withdrawalConsolidatedItemSchema,
    payload,
    undefined,
    "Retiro consolidado actualizado con respuesta inválida.",
  );
}

export async function deleteWithdrawalConsolidated(
  id: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.withdrawals.consolidatedItem(id), { companyId }),
  );
}
