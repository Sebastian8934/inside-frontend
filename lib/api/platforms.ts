import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreatePlatformPayload,
  Platform,
  PlatformDetail,
  UpdatePlatformPayload,
} from "@/types/catalogs";

export async function fetchPlatforms(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<Platform[]>(
      buildApiUrl(API_ENDPOINTS.platforms.list, { companyId, activeOnly }),
    )) ?? []
  );
}

export async function createPlatform(payload: CreatePlatformPayload) {
  return axiosPost<PlatformDetail>(API_ENDPOINTS.platforms.list, payload);
}

export async function updatePlatform(
  id: number,
  payload: UpdatePlatformPayload,
  companyId?: number | null,
) {
  return axiosPut<PlatformDetail>(
    buildApiUrl(API_ENDPOINTS.platforms.detail(id), { companyId }),
    payload,
  );
}
