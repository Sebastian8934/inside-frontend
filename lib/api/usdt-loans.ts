import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  UpdateUsdtLoanPayload,
  UpsertUsdtLoanPayload,
  UsdtLoan,
} from "@/types/usdt-loans";

export type UsdtLoanFilters = {
  companyId?: number | null;
  clientId?: number;
};

export async function fetchUsdtLoans(filters: UsdtLoanFilters = {}) {
  return (
    (await axiosGet<UsdtLoan[]>(
      buildApiUrl(API_ENDPOINTS.usdtLoans.list, filters),
    )) ?? []
  );
}

export async function fetchUsdtLoanById(id: number, companyId?: number | null) {
  return axiosGet<UsdtLoan>(
    buildApiUrl(API_ENDPOINTS.usdtLoans.detail(id), { companyId }),
  );
}

export async function upsertUsdtLoan(payload: UpsertUsdtLoanPayload) {
  return axiosPost<UsdtLoan>(API_ENDPOINTS.usdtLoans.list, payload);
}

export async function updateUsdtLoan(
  id: number,
  payload: UpdateUsdtLoanPayload,
  companyId?: number | null,
) {
  return axiosPut<UsdtLoan>(
    buildApiUrl(API_ENDPOINTS.usdtLoans.detail(id), { companyId }),
    payload,
  );
}
