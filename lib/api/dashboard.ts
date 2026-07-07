import { axiosGetValidated } from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  dashboardDataSchema,
  dashboardSummarySchema,
} from "@/lib/validation/dashboard.schema";
import type { DashboardData, DashboardSummary } from "@/types/dashboard";

export type DashboardFilters = {
  companyId?: number | null;
  date?: string;
  recentActivityLimit?: number;
  topClientsLimit?: number;
};

export async function fetchDashboard(
  filters: DashboardFilters = {},
): Promise<DashboardData> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.dashboard.root, filters),
    dashboardDataSchema,
    undefined,
    "Datos del dashboard inválidos.",
  );
}

export async function fetchDashboardSummary(
  filters: DashboardFilters = {},
): Promise<DashboardSummary> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.dashboard.summary, filters),
    dashboardSummarySchema,
    undefined,
    "Resumen del dashboard inválido.",
  );
}
