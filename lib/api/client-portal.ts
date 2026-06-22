import { axiosGet } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ClientPortalContext,
  ClientPortalDeliverySummary,
  ClientPortalUsdtLoan,
} from "@/types/client-portal";

export type ClientPortalSummaryFilters = {
  currentYear?: number;
};

export async function fetchClientPortalContext() {
  return axiosGet<ClientPortalContext>(API_ENDPOINTS.clientPortal.context);
}

export async function fetchClientPortalDeliverySummary(
  filters: ClientPortalSummaryFilters = {},
) {
  return (
    (await axiosGet<ClientPortalDeliverySummary[]>(
      buildApiUrl(API_ENDPOINTS.clientPortal.deliverySummary, filters),
    )) ?? []
  );
}

export async function fetchClientPortalUsdtLoans() {
  return (
    (await axiosGet<ClientPortalUsdtLoan[]>(
      API_ENDPOINTS.clientPortal.usdtLoans,
    )) ?? []
  );
}
