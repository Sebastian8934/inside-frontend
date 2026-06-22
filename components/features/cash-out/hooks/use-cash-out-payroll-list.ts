"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPayrollEntriesApi } from "@/components/features/cash-out/api/cash-out.api";
import type { PayrollFilters } from "@/lib/api/cash-out";
import { queryKeys } from "@/lib/query/query-keys";

export function useCashOutPayrollList(filters: PayrollFilters) {
  return useQuery({
    queryKey: queryKeys.cashOut.payroll(filters),
    queryFn: () => fetchPayrollEntriesApi(filters),
    enabled: Boolean(filters.companyId),
  });
}
