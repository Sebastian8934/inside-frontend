import { fetchClients } from "@/lib/api/clients";
import {
  createDeliveryMovement,
  fetchDeliveryClientSummary,
  fetchDeliveryMovements,
  updateDeliveryMovement,
} from "@/lib/api/delivery";

export type {
  DeliveryMovementFilters,
  DeliverySummaryFilters,
} from "@/lib/api/delivery";

export {
  fetchDeliveryMovements as fetchDeliveryMovementsApi,
  fetchDeliveryClientSummary as fetchDeliveryClientSummaryApi,
  createDeliveryMovement as createDeliveryMovementApi,
  updateDeliveryMovement as updateDeliveryMovementApi,
  fetchClients as fetchDeliveryClientsApi,
};
