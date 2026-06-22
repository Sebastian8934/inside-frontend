import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateWalletPayload,
  UpdateWalletPayload,
  Wallet,
  WalletDetail,
} from "@/types/catalogs";

export async function fetchWallets(
  companyId?: number | null,
  activeOnly = true,
) {
  return (
    (await axiosGet<Wallet[]>(
      buildApiUrl(API_ENDPOINTS.wallets.list, { companyId, activeOnly }),
    )) ?? []
  );
}

export async function fetchWalletById(id: number, companyId?: number | null) {
  return axiosGet<WalletDetail>(
    buildApiUrl(API_ENDPOINTS.wallets.detail(id), { companyId }),
  );
}

export async function createWallet(payload: CreateWalletPayload) {
  return axiosPost<WalletDetail>(API_ENDPOINTS.wallets.list, payload);
}

export async function updateWallet(
  id: number,
  payload: UpdateWalletPayload,
  companyId?: number | null,
) {
  return axiosPut<WalletDetail>(
    buildApiUrl(API_ENDPOINTS.wallets.detail(id), { companyId }),
    payload,
  );
}
