import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  usdtLoanSchema,
  usdtLoansListSchema,
} from "@/lib/validation/operations.schema";
import type {
  UpdateUsdtLoanPayload,
  UpsertUsdtLoanPayload,
  UsdtLoan,
} from "@/types/usdt-loans";

export type UsdtLoanFilters = {
  companyId?: number | null;
  clientId?: number;
};

export async function fetchUsdtLoans(
  filters: UsdtLoanFilters = {},
): Promise<UsdtLoan[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.usdtLoans.list, filters),
    usdtLoansListSchema,
    undefined,
    "Lista de préstamos USDT inválida.",
  );
}

export async function fetchUsdtLoanById(
  id: number,
  companyId?: number | null,
): Promise<UsdtLoan> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.usdtLoans.detail(id), { companyId }),
    usdtLoanSchema,
    undefined,
    "Detalle de préstamo USDT inválido.",
  );
}

export async function upsertUsdtLoan(
  payload: UpsertUsdtLoanPayload,
): Promise<UsdtLoan> {
  return axiosPostValidated(
    API_ENDPOINTS.usdtLoans.list,
    usdtLoanSchema,
    payload,
    undefined,
    "Préstamo USDT guardado con respuesta inválida.",
  );
}

export async function updateUsdtLoan(
  id: number,
  payload: UpdateUsdtLoanPayload,
  companyId?: number | null,
): Promise<UsdtLoan> {
  return axiosPutValidated(
    buildApiUrl(API_ENDPOINTS.usdtLoans.detail(id), { companyId }),
    usdtLoanSchema,
    payload,
    undefined,
    "Préstamo USDT actualizado con respuesta inválida.",
  );
}
