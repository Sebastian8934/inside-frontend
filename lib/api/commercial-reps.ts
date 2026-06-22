import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CommercialRep,
  CommercialRepDetail,
  CreateCommercialRepPayload,
  UpdateCommercialRepPayload,
} from "@/types/catalogs";

export async function fetchCommercialReps(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<CommercialRep[]>(
      buildApiUrl(API_ENDPOINTS.commercialReps.list, { companyId, activeOnly }),
    )) ?? []
  );
}

export async function createCommercialRep(payload: CreateCommercialRepPayload) {
  return axiosPost<CommercialRepDetail>(
    API_ENDPOINTS.commercialReps.list,
    payload,
  );
}

export async function updateCommercialRep(
  id: number,
  payload: UpdateCommercialRepPayload,
  companyId?: number | null,
) {
  return axiosPut<CommercialRepDetail>(
    buildApiUrl(API_ENDPOINTS.commercialReps.detail(id), { companyId }),
    payload,
  );
}
