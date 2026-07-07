import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  clientDetailSchema,
  clientsListSchema,
} from "@/lib/validation/catalogs.schema";
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/catalogs";

export async function fetchClients(
  companyId?: number | null,
): Promise<Client[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.clients.list, { companyId }),
    clientsListSchema,
    undefined,
    "Lista de clientes inválida.",
  );
}

export async function createClient(
  payload: CreateClientPayload,
): Promise<ClientDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.clients.list,
    clientDetailSchema,
    payload,
    undefined,
    "Cliente creado con respuesta inválida.",
  );
}

export async function updateClient(
  id: number,
  payload: UpdateClientPayload,
  companyId?: number | null,
): Promise<ClientDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.clients.detail(id), { companyId }),
    clientDetailSchema,
    payload,
    undefined,
    "Cliente actualizado con respuesta inválida.",
  );
}
