import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateWithdrawalConsolidatedPayload,
  CreateWithdrawalTransferPayload,
  UpdateWithdrawalConsolidatedPayload,
  UpdateWithdrawalTransferPayload,
  UpsertWithdrawalCompanyLinePayload,
  WithdrawalCompany,
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

export async function fetchWithdrawalCompanies(companyId?: number | null) {
  return (
    (await axiosGet<WithdrawalCompany[]>(
      buildApiUrl(API_ENDPOINTS.withdrawals.companies, { companyId }),
    )) ?? []
  );
}

export async function fetchWithdrawalDays(filters: WithdrawalDayFilters = {}) {
  return (
    (await axiosGet<WithdrawalDayListItem[]>(
      buildApiUrl(API_ENDPOINTS.withdrawals.days, filters),
    )) ?? []
  );
}

export async function fetchWithdrawalDayById(
  id: number,
  companyId?: number | null,
) {
  return axiosGet<WithdrawalDayDetail>(
    buildApiUrl(API_ENDPOINTS.withdrawals.day(id), { companyId }),
  );
}

export async function createWithdrawalDay(
  operationDate: string,
  companyId?: number | null,
) {
  return axiosPost<WithdrawalDayDetail>(API_ENDPOINTS.withdrawals.days, {
    operationDate,
    companyId,
  });
}

export async function upsertWithdrawalCompanyLine(
  dayId: number,
  payload: UpsertWithdrawalCompanyLinePayload,
  companyId?: number | null,
) {
  return axiosPut<WithdrawalDayDetail>(
    buildApiUrl(API_ENDPOINTS.withdrawals.companyLines(dayId), { companyId }),
    payload,
  );
}

export async function createWithdrawalTransfer(
  dayId: number,
  payload: CreateWithdrawalTransferPayload,
  companyId?: number | null,
) {
  return axiosPost<WithdrawalTransfer>(
    buildApiUrl(API_ENDPOINTS.withdrawals.dayTransfers(dayId), { companyId }),
    payload,
  );
}

export async function updateWithdrawalTransfer(
  transferId: number,
  payload: UpdateWithdrawalTransferPayload,
  companyId?: number | null,
) {
  return axiosPut<WithdrawalTransfer>(
    buildApiUrl(API_ENDPOINTS.withdrawals.transfer(transferId), { companyId }),
    payload,
  );
}

export async function deleteWithdrawalTransfer(
  transferId: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.withdrawals.transfer(transferId), { companyId }),
  );
}

export async function fetchWithdrawalConsolidated(
  filters: WithdrawalConsolidatedFilters = {},
) {
  return (
    (await axiosGet<WithdrawalConsolidatedItem[]>(
      buildApiUrl(API_ENDPOINTS.withdrawals.consolidated, filters),
    )) ?? []
  );
}

export async function createWithdrawalConsolidated(
  payload: CreateWithdrawalConsolidatedPayload,
) {
  return axiosPost<WithdrawalConsolidatedItem>(
    API_ENDPOINTS.withdrawals.consolidated,
    payload,
  );
}

export async function updateWithdrawalConsolidated(
  id: number,
  payload: UpdateWithdrawalConsolidatedPayload,
  companyId?: number | null,
) {
  return axiosPut<WithdrawalConsolidatedItem>(
    buildApiUrl(API_ENDPOINTS.withdrawals.consolidatedItem(id), { companyId }),
    payload,
  );
}

export async function deleteWithdrawalConsolidated(
  id: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.withdrawals.consolidatedItem(id), { companyId }),
  );
}
