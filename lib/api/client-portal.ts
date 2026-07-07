import { axiosGetValidated } from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { clientPortalContextSchema } from "@/lib/validation/dashboard.schema";
import {
  clientPortalDeliverySummaryListSchema,
  clientPortalUsdtLoansListSchema,
} from "@/lib/validation/treasury.schema";
import type {
  ClientPortalContext,
  ClientPortalDeliverySummary,
  ClientPortalUsdtLoan,
} from "@/types/client-portal";

export type ClientPortalSummaryFilters = {
  currentYear?: number;
};

export async function fetchClientPortalContext(): Promise<ClientPortalContext> {
  return axiosGetValidated(
    API_ENDPOINTS.clientPortal.context,
    clientPortalContextSchema,
    undefined,
    "Contexto del portal cliente inválido.",
  );
}

export async function fetchClientPortalDeliverySummary(
  filters: ClientPortalSummaryFilters = {},
): Promise<ClientPortalDeliverySummary[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.clientPortal.deliverySummary, filters),
    clientPortalDeliverySummaryListSchema,
    undefined,
    "Resumen delivery del portal cliente inválido.",
  );
}

export async function fetchClientPortalUsdtLoans(): Promise<
  ClientPortalUsdtLoan[]
> {
  return axiosGetValidated(
    API_ENDPOINTS.clientPortal.usdtLoans,
    clientPortalUsdtLoansListSchema,
    undefined,
    "Préstamos USDT del portal cliente inválidos.",
  );
}
