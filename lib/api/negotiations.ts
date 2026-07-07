import { axiosDelete } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  dailyNegotiationDetailSchema,
  dailyNegotiationsListSchema,
  negotiationDailyQuotaSchema,
  negotiationLineSchema,
  negotiationRateScenarioSchema,
} from "@/lib/validation/treasury.schema";
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

export async function fetchNegotiationDays(
  filters: NegotiationDayFilters = {},
): Promise<DailyNegotiationListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.days, filters),
    dailyNegotiationsListSchema,
    undefined,
    "Lista de días de negociación inválida.",
  );
}

export async function fetchNegotiationDayById(
  id: number,
  companyId?: number | null,
): Promise<DailyNegotiationDetail> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.day(id), { companyId }),
    dailyNegotiationDetailSchema,
    undefined,
    "Detalle de día de negociación inválido.",
  );
}

export async function createNegotiationDay(
  payload: CreateDailyNegotiationPayload,
): Promise<DailyNegotiationDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.negotiations.days,
    dailyNegotiationDetailSchema,
    payload,
    undefined,
    "Día de negociación creado con respuesta inválida.",
  );
}

export async function updateNegotiationDay(
  id: number,
  payload: UpdateDailyNegotiationPayload,
  companyId?: number | null,
): Promise<DailyNegotiationDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.day(id), { companyId }),
    dailyNegotiationDetailSchema,
    payload,
    undefined,
    "Día de negociación actualizado con respuesta inválida.",
  );
}

export async function closeNegotiationDay(
  id: number,
  companyId?: number | null,
): Promise<DailyNegotiationDetail> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.closeDay(id), { companyId }),
    dailyNegotiationDetailSchema,
    undefined,
    undefined,
    "Cierre de día de negociación con respuesta inválida.",
  );
}

export async function createNegotiationLine(
  dayId: number,
  payload: UpsertNegotiationLinePayload,
  companyId?: number | null,
): Promise<NegotiationLine> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.lines(dayId), { companyId }),
    negotiationLineSchema,
    payload,
    undefined,
    "Línea de negociación creada con respuesta inválida.",
  );
}

export async function updateNegotiationLine(
  lineId: number,
  payload: UpsertNegotiationLinePayload,
  companyId?: number | null,
): Promise<NegotiationLine> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.line(lineId), { companyId }),
    negotiationLineSchema,
    payload,
    undefined,
    "Línea de negociación actualizada con respuesta inválida.",
  );
}

export async function deleteNegotiationLine(
  lineId: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.negotiations.line(lineId), { companyId }),
  );
}

export async function createRateScenario(
  dayId: number,
  payload: UpsertRateScenarioPayload,
  companyId?: number | null,
): Promise<NegotiationRateScenario> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.rateScenarios(dayId), { companyId }),
    negotiationRateScenarioSchema,
    payload,
    undefined,
    "Escenario de tasa creado con respuesta inválida.",
  );
}

export async function updateRateScenario(
  scenarioId: number,
  payload: UpsertRateScenarioPayload,
  companyId?: number | null,
): Promise<NegotiationRateScenario> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.rateScenario(scenarioId), {
      companyId,
    }),
    negotiationRateScenarioSchema,
    payload,
    undefined,
    "Escenario de tasa actualizado con respuesta inválida.",
  );
}

export async function deleteRateScenario(
  scenarioId: number,
  companyId?: number | null,
): Promise<void> {
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
): Promise<NegotiationDailyQuota> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.quotas(dayId), { companyId }),
    negotiationDailyQuotaSchema,
    payload,
    undefined,
    "Cupo diario creado con respuesta inválida.",
  );
}

export async function updateQuota(
  quotaId: number,
  payload: UpdateQuotaPayload,
  companyId?: number | null,
): Promise<NegotiationDailyQuota> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.negotiations.quota(quotaId), { companyId }),
    negotiationDailyQuotaSchema,
    payload,
    undefined,
    "Cupo diario actualizado con respuesta inválida.",
  );
}

export async function deleteQuota(
  quotaId: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.negotiations.quota(quotaId), { companyId }),
  );
}
