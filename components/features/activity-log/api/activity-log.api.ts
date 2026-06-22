import { createActivityLog, fetchActivityLogs } from "@/lib/api/activity-log";

export type { ActivityLogFilters } from "@/lib/api/activity-log";

export {
  fetchActivityLogs as fetchActivityLogsApi,
  createActivityLog as createActivityLogApi,
};
