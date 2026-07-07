import { axiosDelete } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  dailyLiquidityCloseDetailSchema,
  dailyLiquidityClosesListSchema,
  liquidityPositionLineSchema,
} from "@/lib/validation/treasury.schema";
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

export async function fetchLiquidityCloses(
  filters: LiquidityCloseFilters = {},
): Promise<DailyLiquidityCloseListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.closes, filters),
    dailyLiquidityClosesListSchema,
    undefined,
    "Lista de cierres de liquidez inválida.",
  );
}

export async function fetchLiquidityCloseById(
  id: number,
  companyId?: number | null,
): Promise<DailyLiquidityCloseDetail> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.close(id), { companyId }),
    dailyLiquidityCloseDetailSchema,
    undefined,
    "Detalle de cierre de liquidez inválido.",
  );
}

export async function createLiquidityClose(
  payload: CreateDailyLiquidityClosePayload,
): Promise<DailyLiquidityCloseDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.liquidity.closes,
    dailyLiquidityCloseDetailSchema,
    payload,
    undefined,
    "Cierre de liquidez creado con respuesta inválida.",
  );
}

export async function updateLiquidityClose(
  id: number,
  payload: UpdateDailyLiquidityClosePayload,
  companyId?: number | null,
): Promise<DailyLiquidityCloseDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.close(id), { companyId }),
    dailyLiquidityCloseDetailSchema,
    payload,
    undefined,
    "Cierre de liquidez actualizado con respuesta inválida.",
  );
}

export async function closeLiquidityDay(
  id: number,
  companyId?: number | null,
): Promise<DailyLiquidityCloseDetail> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.closeDay(id), { companyId }),
    dailyLiquidityCloseDetailSchema,
    undefined,
    undefined,
    "Cierre de día de liquidez con respuesta inválida.",
  );
}

export async function refreshLiquidityFromDelivery(
  id: number,
  companyId?: number | null,
): Promise<DailyLiquidityCloseDetail> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.refreshDelivery(id), { companyId }),
    dailyLiquidityCloseDetailSchema,
    undefined,
    undefined,
    "Actualización de liquidez desde delivery con respuesta inválida.",
  );
}

export type RefreshLiquiditySourcesOptions = {
  delivery?: boolean;
  inventory?: boolean;
  banks?: boolean;
};

export async function refreshLiquiditySources(
  id: number,
  options: RefreshLiquiditySourcesOptions = {},
  companyId?: number | null,
): Promise<DailyLiquidityCloseDetail> {
  const { delivery = true, inventory = true, banks = true } = options;

  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.refreshSources(id), {
      companyId,
      delivery,
      inventory,
      banks,
    }),
    dailyLiquidityCloseDetailSchema,
    undefined,
    undefined,
    "Actualización de fuentes de liquidez con respuesta inválida.",
  );
}

export async function createLiquidityPositionLine(
  closeId: number,
  payload: UpsertLiquidityPositionLinePayload,
  companyId?: number | null,
): Promise<LiquidityPositionLine> {
  return axiosPostValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.lines(closeId), { companyId }),
    liquidityPositionLineSchema,
    payload,
    undefined,
    "Línea de posición de liquidez creada con respuesta inválida.",
  );
}

export async function updateLiquidityPositionLine(
  lineId: number,
  payload: UpsertLiquidityPositionLinePayload,
  companyId?: number | null,
): Promise<LiquidityPositionLine> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.liquidity.line(lineId), { companyId }),
    liquidityPositionLineSchema,
    payload,
    undefined,
    "Línea de posición de liquidez actualizada con respuesta inválida.",
  );
}

export async function deleteLiquidityPositionLine(
  lineId: number,
  companyId?: number | null,
): Promise<void> {
  await axiosDelete(
    buildApiUrl(API_ENDPOINTS.liquidity.line(lineId), { companyId }),
  );
}
