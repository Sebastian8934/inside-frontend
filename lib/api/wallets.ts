import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  walletDetailSchema,
  walletsListSchema,
} from "@/lib/validation/catalogs.schema";
import type {
  CreateWalletPayload,
  UpdateWalletPayload,
  Wallet,
  WalletDetail,
} from "@/types/catalogs";

export async function fetchWallets(
  companyId?: number | null,
  activeOnly = true,
): Promise<Wallet[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.wallets.list, { companyId, activeOnly }),
    walletsListSchema,
    undefined,
    "Lista de wallets inválida.",
  );
}

export async function fetchWalletById(
  id: number,
  companyId?: number | null,
): Promise<WalletDetail> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.wallets.detail(id), { companyId }),
    walletDetailSchema,
    undefined,
    "Detalle de wallet inválido.",
  );
}

export async function createWallet(
  payload: CreateWalletPayload,
): Promise<WalletDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.wallets.list,
    walletDetailSchema,
    payload,
    undefined,
    "Wallet creada con respuesta inválida.",
  );
}

export async function updateWallet(
  id: number,
  payload: UpdateWalletPayload,
  companyId?: number | null,
): Promise<WalletDetail> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.wallets.detail(id), { companyId }),
    walletDetailSchema,
    payload,
    undefined,
    "Wallet actualizada con respuesta inválida.",
  );
}
