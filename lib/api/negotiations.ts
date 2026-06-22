import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateDailyNegotiationPayload,
  CreateQuotaPayload,
  DailyNegotiationDetail,
  DailyNegotiationListItem,
  NegotiationDailyQuota,
  NegotiationLine,
  NegotiationRateScenario,
  UpdateDailyNegotiationPayload,
  UpdateQuotaPayload,
  UpsertNegotiationLinePayload,
  UpsertRateScenarioPayload,
} from "@/types/negotiations";

export type NegotiationDayFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
};

export async function fetchNegotiationDays(filters: NegotiationDayFilters = {}) {
  return (
    (await axiosGet<DailyNegotiationListItem[]>(
      buildApiUrl(API_ENDPOINTS.negotiations.days, filters),
    )) ?? []
  );
}

export async function fetchNegotiationDayById(
  id: number,
  companyId?: number | null,
) {
  return axiosGet<DailyNegotiationDetail>(
    buildApiUrl(API_ENDPOINTS.negotiations.day(id), { companyId }),
  );
}

export async function createNegotiationDay(
  payload: CreateDailyNegotiationPayload,
) {
  return axiosPost<DailyNegotiationDetail>(
    API_ENDPOINTS.negotiations.days,
    payload,
  );
}

export async function updateNegotiationDay(
  id: number,
  payload: UpdateDailyNegotiationPayload,
  companyId?: number | null,
) {
  return axiosPut<DailyNegotiationDetail>(
    buildApiUrl(API_ENDPOINTS.negotiations.day(id), { companyId }),
    payload,
  );
}

export async function closeNegotiationDay(
  id: number,
  companyId?: number | null,
) {
  return axiosPost<DailyNegotiationDetail>(
    buildApiUrl(API_ENDPOINTS.negotiations.closeDay(id), { companyId }),
  );
}

export async function createNegotiationLine(
  dayId: number,
  payload: UpsertNegotiationLinePayload,
  companyId?: number | null,
) {
  return axiosPost<NegotiationLine>(
    buildApiUrl(API_ENDPOINTS.negotiations.lines(dayId), { companyId }),
    payload,
  );
}

export async function updateNegotiationLine(
  lineId: number,
  payload: UpsertNegotiationLinePayload,
  companyId?: number | null,
) {
  return axiosPut<NegotiationLine>(
    buildApiUrl(API_ENDPOINTS.negotiations.line(lineId), { companyId }),
    payload,
  );
}

export async function deleteNegotiationLine(
  lineId: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.negotiations.line(lineId), { companyId }),
  );
}

export async function createRateScenario(
  dayId: number,
  payload: UpsertRateScenarioPayload,
  companyId?: number | null,
) {
  return axiosPost<NegotiationRateScenario>(
    buildApiUrl(API_ENDPOINTS.negotiations.rateScenarios(dayId), { companyId }),
    payload,
  );
}

export async function updateRateScenario(
  scenarioId: number,
  payload: UpsertRateScenarioPayload,
  companyId?: number | null,
) {
  return axiosPut<NegotiationRateScenario>(
    buildApiUrl(API_ENDPOINTS.negotiations.rateScenario(scenarioId), {
      companyId,
    }),
    payload,
  );
}

export async function deleteRateScenario(
  scenarioId: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.negotiations.rateScenario(scenarioId), {
      companyId,
    }),
  );
}

export async function createQuota(
  dayId: number,
  payload: CreateQuotaPayload,
  companyId?: number | null,
) {
  return axiosPost<NegotiationDailyQuota>(
    buildApiUrl(API_ENDPOINTS.negotiations.quotas(dayId), { companyId }),
    payload,
  );
}

export async function updateQuota(
  quotaId: number,
  payload: UpdateQuotaPayload,
  companyId?: number | null,
) {
  return axiosPut<NegotiationDailyQuota>(
    buildApiUrl(API_ENDPOINTS.negotiations.quota(quotaId), { companyId }),
    payload,
  );
}

export async function deleteQuota(
  quotaId: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.negotiations.quota(quotaId), { companyId }),
  );
}
