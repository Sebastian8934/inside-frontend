"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchClientPortalDeliverySummary,
  fetchClientPortalUsdtLoans,
} from "@/components/features/client-portal/api/client-portal.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useClientPortalDashboard(currentYear: number) {
  const deliveryQuery = useQuery({
    queryKey: queryKeys.clientPortal.deliverySummary({ currentYear }),
    queryFn: () => fetchClientPortalDeliverySummary({ currentYear }),
  });

  const loansQuery = useQuery({
    queryKey: queryKeys.clientPortal.usdtLoans,
    queryFn: fetchClientPortalUsdtLoans,
  });

  return {
    deliverySummary: deliveryQuery.data ?? [],
    loans: loansQuery.data ?? [],
    isLoading: deliveryQuery.isLoading || loansQuery.isLoading,
  };
}
