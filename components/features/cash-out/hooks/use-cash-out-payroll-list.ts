"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPayrollEntriesApi } from "@/components/features/cash-out/api/cash-out.api";
import type { PayrollFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useCashOutPayrollList(filters: PayrollFilters) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.cashOut.payroll(filters),
    queryFn: () => fetchPayrollEntriesApi(filters),
    enabled: authReady && Boolean(filters.companyId),
  });
}
