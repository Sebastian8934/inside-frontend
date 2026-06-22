import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
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
) {
  return (
    (await axiosGet<DeliveryMovementListItem[]>(
      buildApiUrl(API_ENDPOINTS.delivery.movements, filters),
    )) ?? []
  );
}

export async function fetchDeliveryMovementById(
  id: number,
  companyId?: number | null,
) {
  return axiosGet<DeliveryMovementDetail>(
    buildApiUrl(API_ENDPOINTS.delivery.movement(id), { companyId }),
  );
}

export async function createDeliveryMovement(
  payload: CreateDeliveryMovementPayload,
) {
  return axiosPost<DeliveryMovementDetail>(
    API_ENDPOINTS.delivery.movements,
    payload,
  );
}

export async function updateDeliveryMovement(
  id: number,
  payload: UpdateDeliveryMovementPayload,
  companyId?: number | null,
) {
  return axiosPut<DeliveryMovementDetail>(
    buildApiUrl(API_ENDPOINTS.delivery.movement(id), { companyId }),
    payload,
  );
}

export async function fetchDeliveryClientSummary(
  filters: DeliverySummaryFilters = {},
) {
  return (
    (await axiosGet<DeliveryClientSummary[]>(
      buildApiUrl(API_ENDPOINTS.delivery.clientSummary, filters),
    )) ?? []
  );
}
