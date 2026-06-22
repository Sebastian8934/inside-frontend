import { axiosGet } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { DashboardData, DashboardSummary } from "@/types/dashboard";

export type DashboardFilters = {
  companyId?: number | null;
  date?: string;
  recentActivityLimit?: number;
  topClientsLimit?: number;
};

export async function fetchDashboard(filters: DashboardFilters = {}) {
  return axiosGet<DashboardData>(
    buildApiUrl(API_ENDPOINTS.dashboard.root, filters),
  );
}

export async function fetchDashboardSummary(filters: DashboardFilters = {}) {
  return axiosGet<DashboardSummary>(
    buildApiUrl(API_ENDPOINTS.dashboard.summary, filters),
  );
}
