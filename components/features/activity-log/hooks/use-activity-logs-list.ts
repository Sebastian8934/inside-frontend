"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchActivityLogsApi,
  type ActivityLogFilters,
} from "@/components/features/activity-log/api/activity-log.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useActivityLogsList(filters: ActivityLogFilters) {
  return useQuery({
    queryKey: queryKeys.activityLog.all(filters),
    queryFn: () => fetchActivityLogsApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
