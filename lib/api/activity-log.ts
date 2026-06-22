import { axiosGet, axiosPost } from "@/lib/axios";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ActivityLogListItem,
  CreateActivityLogPayload,
} from "@/types/activity-log";

export type ActivityLogFilters = {
  companyId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  activityType?: string;
  limit?: number;
};

export async function fetchActivityLogs(filters: ActivityLogFilters = {}) {
  return (
    (await axiosGet<ActivityLogListItem[]>(
      buildApiUrl(API_ENDPOINTS.activityLog.list, filters),
    )) ?? []
  );
}

export async function createActivityLog(payload: CreateActivityLogPayload) {
  return axiosPost<ActivityLogListItem>(API_ENDPOINTS.activityLog.list, payload);
}
