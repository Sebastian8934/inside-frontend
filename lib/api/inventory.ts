import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  inventoryMovementSchema,
  inventoryMovementsListSchema,
  otcSummaryListSchema,
} from "@/lib/validation/operations.schema";
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

export async function fetchMovements(
  filters: MovementFilters = {},
): Promise<InventoryMovement[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.inventory.movements, filters),
    inventoryMovementsListSchema,
    undefined,
    "Lista de movimientos de inventario inválida.",
  );
}

export async function createMovement(
  payload: CreateMovementPayload,
): Promise<InventoryMovement> {
  return axiosPostValidated(
    API_ENDPOINTS.inventory.movements,
    inventoryMovementSchema,
    payload,
    undefined,
    "Movimiento de inventario creado con respuesta inválida.",
  );
}

export async function updateMovement(
  id: number,
  payload: UpdateMovementPayload,
  companyId?: number | null,
): Promise<InventoryMovement> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.inventory.movement(id), { companyId }),
    inventoryMovementSchema,
    payload,
    undefined,
    "Movimiento de inventario actualizado con respuesta inválida.",
  );
}

export type OtcSummaryFilters = {
  companyId?: number | null;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  otcCounterpartyId?: number;
};

export async function fetchOtcSummary(
  filters: OtcSummaryFilters = {},
): Promise<OtcSummaryItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.inventory.otcSummary, filters),
    otcSummaryListSchema,
    undefined,
    "Resumen OTC inválido.",
  );
}
