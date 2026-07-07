import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  otcCounterpartiesListSchema,
  otcCounterpartyDetailSchema,
} from "@/lib/validation/catalogs.schema";
import type {
  CreateOtcCounterpartyPayload,
  OtcCounterparty,
  OtcCounterpartyDetail,
  UpdateOtcCounterpartyPayload,
} from "@/types/catalogs";

export async function fetchOtcCounterparties(
  companyId?: number | null,
  activeOnly = true,
): Promise<OtcCounterparty[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.otcCounterparties.list, {
      companyId,
      activeOnly,
    }),
    otcCounterpartiesListSchema,
    undefined,
    "Lista de contrapartes OTC inválida.",
  );
}

export async function createOtcCounterparty(
  payload: CreateOtcCounterpartyPayload,
): Promise<OtcCounterpartyDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.otcCounterparties.list,
    otcCounterpartyDetailSchema,
    payload,
    undefined,
    "Contraparte OTC creada con respuesta inválida.",
  );
}

export async function updateOtcCounterparty(
  id: number,
  payload: UpdateOtcCounterpartyPayload,
  companyId?: number | null,
): Promise<OtcCounterpartyDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.otcCounterparties.detail(id), { companyId }),
    otcCounterpartyDetailSchema,
    payload,
    undefined,
    "Contraparte OTC actualizada con respuesta inválida.",
  );
}
