import {
  axiosGetValidated,
  axiosPostValidated,
} from "@/lib/axios/validated";
import { buildApiUrl } from "@/lib/api/build-url";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  activityLogListItemSchema,
  activityLogsListSchema,
} from "@/lib/validation/operations.schema";
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

export async function fetchActivityLogs(
  filters: ActivityLogFilters = {},
): Promise<ActivityLogListItem[]> {
  return axiosGetValidated(
    buildApiUrl(API_ENDPOINTS.activityLog.list, filters),
    activityLogsListSchema,
    undefined,
    "Lista de actividad inválida.",
  );
}

export async function createActivityLog(
  payload: CreateActivityLogPayload,
): Promise<ActivityLogListItem> {
  return axiosPostValidated(
    API_ENDPOINTS.activityLog.list,
    activityLogListItemSchema,
    payload,
    undefined,
    "Actividad creada con respuesta inválida.",
  );
}
