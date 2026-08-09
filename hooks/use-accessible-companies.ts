"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAccessibleCompanies } from "@/lib/api/companies";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

export function useAccessibleCompanies(includeInactive = false) {
  const enabled = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.companies.all(includeInactive),
    queryFn: () => fetchAccessibleCompanies(includeInactive),
    enabled,
  });
}
