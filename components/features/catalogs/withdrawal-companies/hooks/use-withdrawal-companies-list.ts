"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWithdrawalCompanies } from "@/components/features/catalogs/withdrawal-companies/api/withdrawal-companies.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useWithdrawalCompaniesList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.withdrawals.companies({
      companyId,
      activeOnly: false,
    }),
    queryFn: () => fetchWithdrawalCompanies(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}
