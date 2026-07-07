import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  commercialRepDetailSchema,
  commercialRepsListSchema,
} from "@/lib/validation/catalogs.schema";
import type {
  CommercialRep,
  CommercialRepDetail,
  CreateCommercialRepPayload,
  UpdateCommercialRepPayload,
} from "@/types/catalogs";

export async function fetchCommercialReps(
  companyId?: number | null,
  activeOnly = true,
): Promise<CommercialRep[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.commercialReps.list, { companyId, activeOnly }),
    commercialRepsListSchema,
    undefined,
    "Lista de representantes comerciales inválida.",
  );
}

export async function createCommercialRep(
  payload: CreateCommercialRepPayload,
): Promise<CommercialRepDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.commercialReps.list,
    commercialRepDetailSchema,
    payload,
    undefined,
    "Representante comercial creado con respuesta inválida.",
  );
}

export async function updateCommercialRep(
  id: number,
  payload: UpdateCommercialRepPayload,
  companyId?: number | null,
): Promise<CommercialRepDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.commercialReps.detail(id), { companyId }),
    commercialRepDetailSchema,
    payload,
    undefined,
    "Representante comercial actualizado con respuesta inválida.",
  );
}
