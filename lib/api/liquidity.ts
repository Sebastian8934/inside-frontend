import { axiosDelete, axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateDailyLiquidityClosePayload,
  DailyLiquidityCloseDetail,
  DailyLiquidityCloseListItem,
  LiquidityPositionLine,
  UpdateDailyLiquidityClosePayload,
  UpsertLiquidityPositionLinePayload,
} from "@/types/liquidity";

export type LiquidityCloseFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
};

export async function fetchLiquidityCloses(filters: LiquidityCloseFilters = {}) {
  return (
    (await axiosGet<DailyLiquidityCloseListItem[]>(
      buildApiUrl(API_ENDPOINTS.liquidity.closes, filters),
    )) ?? []
  );
}

export async function fetchLiquidityCloseById(
  id: number,
  companyId?: number | null,
) {
  return axiosGet<DailyLiquidityCloseDetail>(
    buildApiUrl(API_ENDPOINTS.liquidity.close(id), { companyId }),
  );
}

export async function createLiquidityClose(
  payload: CreateDailyLiquidityClosePayload,
) {
  return axiosPost<DailyLiquidityCloseDetail>(
    API_ENDPOINTS.liquidity.closes,
    payload,
  );
}

export async function updateLiquidityClose(
  id: number,
  payload: UpdateDailyLiquidityClosePayload,
  companyId?: number | null,
) {
  return axiosPut<DailyLiquidityCloseDetail>(
    buildApiUrl(API_ENDPOINTS.liquidity.close(id), { companyId }),
    payload,
  );
}

export async function closeLiquidityDay(id: number, companyId?: number | null) {
  return axiosPost<DailyLiquidityCloseDetail>(
    buildApiUrl(API_ENDPOINTS.liquidity.closeDay(id), { companyId }),
  );
}

export async function refreshLiquidityFromDelivery(
  id: number,
  companyId?: number | null,
) {
  return axiosPost<DailyLiquidityCloseDetail>(
    buildApiUrl(API_ENDPOINTS.liquidity.refreshDelivery(id), { companyId }),
  );
}

export async function createLiquidityPositionLine(
  closeId: number,
  payload: UpsertLiquidityPositionLinePayload,
  companyId?: number | null,
) {
  return axiosPost<LiquidityPositionLine>(
    buildApiUrl(API_ENDPOINTS.liquidity.lines(closeId), { companyId }),
    payload,
  );
}

export async function updateLiquidityPositionLine(
  lineId: number,
  payload: UpsertLiquidityPositionLinePayload,
  companyId?: number | null,
) {
  return axiosPut<LiquidityPositionLine>(
    buildApiUrl(API_ENDPOINTS.liquidity.line(lineId), { companyId }),
    payload,
  );
}

export async function deleteLiquidityPositionLine(
  lineId: number,
  companyId?: number | null,
) {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.liquidity.line(lineId), { companyId }),
  );
}
