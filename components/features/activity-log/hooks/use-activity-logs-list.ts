"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchActivityLogsApi,
  type ActivityLogFilters,
} from "@/components/features/activity-log/api/activity-log.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useActivityLogsList(filters: ActivityLogFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.activityLog.all(filters),
    queryFn: () => fetchActivityLogsApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
