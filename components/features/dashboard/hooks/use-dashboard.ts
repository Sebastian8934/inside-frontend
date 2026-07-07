"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/components/features/dashboard/api/dashboard.api";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
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
  const queryEnabled = useAuthQueryEnabled(Boolean(companyId) && enabled);

  return useQuery({
    queryKey: queryKeys.dashboard.all({ companyId, date }),
    queryFn: () =>
      fetchDashboard({
        companyId,
        date,
        recentActivityLimit: 10,
        topClientsLimit: 5,
      }),
    enabled: queryEnabled,
  });
}
