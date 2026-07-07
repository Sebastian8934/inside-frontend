import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  deliveryClientSummaryListSchema,
  deliveryMovementDetailSchema,
  deliveryMovementsListSchema,
} from "@/lib/validation/operations.schema";
import type {
  CreateDeliveryMovementPayload,
  DeliveryClientSummary,
  DeliveryMovementDetail,
  DeliveryMovementListItem,
  UpdateDeliveryMovementPayload,
} from "@/types/delivery";

export type DeliveryMovementFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  clientId?: number;
  movementType?: string;
  referenceKey?: string;
};

export type DeliverySummaryFilters = {
  companyId?: number | null;
  clientId?: number;
  currentYear?: number;
};

export async function fetchDeliveryMovements(
  filters: DeliveryMovementFilters = {},
): Promise<DeliveryMovementListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.delivery.movements, filters),
    deliveryMovementsListSchema,
    undefined,
    "Lista de movimientos de delivery inválida.",
  );
}

export async function fetchDeliveryMovementById(
  id: number,
  companyId?: number | null,
): Promise<DeliveryMovementDetail> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.delivery.movement(id), { companyId }),
    deliveryMovementDetailSchema,
    undefined,
    "Detalle de movimiento de delivery inválido.",
  );
}

export async function createDeliveryMovement(
  payload: CreateDeliveryMovementPayload,
): Promise<DeliveryMovementDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.delivery.movements,
    deliveryMovementDetailSchema,
    payload,
    undefined,
    "Movimiento de delivery creado con respuesta inválida.",
  );
}

export async function updateDeliveryMovement(
  id: number,
  payload: UpdateDeliveryMovementPayload,
  companyId?: number | null,
): Promise<DeliveryMovementDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.delivery.movement(id), { companyId }),
    deliveryMovementDetailSchema,
    payload,
    undefined,
    "Movimiento de delivery actualizado con respuesta inválida.",
  );
}

export async function fetchDeliveryClientSummary(
  filters: DeliverySummaryFilters = {},
): Promise<DeliveryClientSummary[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.delivery.clientSummary, filters),
    deliveryClientSummaryListSchema,
    undefined,
    "Resumen de clientes delivery inválido.",
  );
}
