import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateOtcCounterpartyPayload,
  OtcCounterparty,
  OtcCounterpartyDetail,
  UpdateOtcCounterpartyPayload,
} from "@/types/catalogs";

export async function fetchOtcCounterparties(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<OtcCounterparty[]>(
      buildApiUrl(API_ENDPOINTS.otcCounterparties.list, {
        companyId,
        activeOnly,
      }),
    )) ?? []
  );
}

export async function createOtcCounterparty(
  payload: CreateOtcCounterpartyPayload,
) {
  return axiosPost<OtcCounterpartyDetail>(
    API_ENDPOINTS.otcCounterparties.list,
    payload,
  );
}

export async function updateOtcCounterparty(
  id: number,
  payload: UpdateOtcCounterpartyPayload,
  companyId?: number | null,
) {
  return axiosPut<OtcCounterpartyDetail>(
    buildApiUrl(API_ENDPOINTS.otcCounterparties.detail(id), { companyId }),
    payload,
  );
}
