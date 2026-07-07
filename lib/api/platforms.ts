import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  platformDetailSchema,
  platformsListSchema,
} from "@/lib/validation/catalogs.schema";
import type {
  CreatePlatformPayload,
  Platform,
  PlatformDetail,
  UpdatePlatformPayload,
} from "@/types/catalogs";

export async function fetchPlatforms(
  companyId?: number | null,
  activeOnly = true,
): Promise<Platform[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.platforms.list, { companyId, activeOnly }),
    platformsListSchema,
    undefined,
    "Lista de plataformas inválida.",
  );
}

export async function createPlatform(
  payload: CreatePlatformPayload,
): Promise<PlatformDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.platforms.list,
    platformDetailSchema,
    payload,
    undefined,
    "Plataforma creada con respuesta inválida.",
  );
}

export async function updatePlatform(
  id: number,
  payload: UpdatePlatformPayload,
  companyId?: number | null,
): Promise<PlatformDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.platforms.detail(id), { companyId }),
    platformDetailSchema,
    payload,
    undefined,
    "Plataforma actualizada con respuesta inválida.",
  );
}
