import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/catalogs";

export async function fetchClients(companyId?: number | null) {
  return (
    (await axiosGet<Client[]>(
      buildApiUrl(API_ENDPOINTS.clients.list, { companyId }),
    )) ?? []
  );
}

export async function createClient(payload: CreateClientPayload) {
  return axiosPost<ClientDetail>(API_ENDPOINTS.clients.list, payload);
}

export async function updateClient(
  id: number,
  payload: UpdateClientPayload,
  companyId?: number | null,
) {
  return axiosPut<ClientDetail>(
    buildApiUrl(API_ENDPOINTS.clients.detail(id), { companyId }),
    payload,
  );
}
