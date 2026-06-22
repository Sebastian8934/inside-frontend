import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateMovementPayload,
  InventoryMovement,
  OtcSummaryItem,
  UpdateMovementPayload,
} from "@/types/inventory";

export type MovementFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  clientId?: number;
  movementType?: string;
  otcCounterpartyId?: number;
  txHash?: string;
};

export async function fetchMovements(filters: MovementFilters = {}) {
  return (
    (await axiosGet<InventoryMovement[]>(
      buildApiUrl(API_ENDPOINTS.inventory.movements, filters),
    )) ?? []
  );
}

export async function createMovement(payload: CreateMovementPayload) {
  return axiosPost<InventoryMovement>(
    API_ENDPOINTS.inventory.movements,
    payload,
  );
}

export async function updateMovement(
  id: number,
  payload: UpdateMovementPayload,
  companyId?: number | null,
) {
  return axiosPut<InventoryMovement>(
    buildApiUrl(API_ENDPOINTS.inventory.movement(id), { companyId }),
    payload,
  );
}

export type OtcSummaryFilters = {
  companyId?: number | null;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  otcCounterpartyId?: number;
};

export async function fetchOtcSummary(filters: OtcSummaryFilters = {}) {
  return (
    (await axiosGet<OtcSummaryItem[]>(
      buildApiUrl(API_ENDPOINTS.inventory.otcSummary, filters),
    )) ?? []
  );
}
