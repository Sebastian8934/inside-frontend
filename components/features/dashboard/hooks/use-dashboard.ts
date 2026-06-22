"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/components/features/dashboard/api/dashboard.api";
import { queryKeys } from "@/lib/query/query-keys";

type UseDashboardOptions = {
  companyId: number | null;
  date: string;
  enabled?: boolean;
};

export function useDashboard({
  companyId,
  date,
  enabled = true,
}: UseDashboardOptions) {
  return useQuery({
    queryKey: queryKeys.dashboard.all({ companyId, date }),
    queryFn: () =>
      fetchDashboard({
        companyId,
        date,
        recentActivityLimit: 10,
        topClientsLimit: 5,
      }),
    enabled: Boolean(companyId) && enabled,
  });
}
