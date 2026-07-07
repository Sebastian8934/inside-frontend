"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchClientPortalDeliverySummary,
  fetchClientPortalUsdtLoans,
} from "@/components/features/client-portal/api/client-portal.api";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

export function useClientPortalDashboard(currentYear: number) {
  const enabled = useAuthQueryEnabled();

  const deliveryQuery = useQuery({
    queryKey: queryKeys.clientPortal.deliverySummary({ currentYear }),
    queryFn: () => fetchClientPortalDeliverySummary({ currentYear }),
    enabled,
  });

  const loansQuery = useQuery({
    queryKey: queryKeys.clientPortal.usdtLoans,
    queryFn: fetchClientPortalUsdtLoans,
    enabled,
  });

  return {
    deliverySummary: deliveryQuery.data ?? [],
    loans: loansQuery.data ?? [],
    isLoading: deliveryQuery.isLoading || loansQuery.isLoading,
  };
}
