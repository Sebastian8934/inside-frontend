import {
  fetchClients,
  createClient,
  updateClient,
} from "@/lib/api/clients";
import {
  fetchMovements,
  createMovement,
  updateMovement,
} from "@/lib/api/inventory";
import {
  fetchOtcCounterparties,
} from "@/lib/api/otc-counterparties";
import { fetchWallets } from "@/lib/api/wallets";

export type { MovementFilters } from "@/lib/api/inventory";

export {
  fetchMovements as fetchMovementsApi,
  createMovement as createMovementApi,
  updateMovement as updateMovementApi,
};

export {
  fetchClients as fetchMovementClientsApi,
  fetchWallets as fetchMovementWalletsApi,
  fetchOtcCounterparties as fetchMovementCounterpartiesApi,
};

export { createClient, updateClient };
