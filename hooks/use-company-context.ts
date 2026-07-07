"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { fetchCompanyContext } from "@/lib/api/companies";
import { queryKeys } from "@/lib/query/query-keys";
import { useAppStore } from "@/stores/app-store";

export function useCompanyContext() {
  const enabled = useAuthQueryEnabled();
  const activeCompanyId = useAppStore((state) => state.activeCompanyId);
  const setActiveCompanyId = useAppStore((state) => state.setActiveCompanyId);

  const query = useQuery({
    queryKey: queryKeys.companies.context,
    queryFn: fetchCompanyContext,
    enabled,
  });

  useEffect(() => {
    if (!query.data) return;

    const resolvedCompanyId =
      activeCompanyId ??
      query.data.activeCompanyId ??
      query.data.defaultCompanyId;

    if (activeCompanyId !== resolvedCompanyId) {
      setActiveCompanyId(resolvedCompanyId);
    }
  }, [query.data, activeCompanyId, setActiveCompanyId]);

  const activeCompany =
    query.data?.accessibleCompanies.find(
      (company) => company.id === activeCompanyId,
    ) ?? query.data?.accessibleCompanies[0];

  return {
    ...query,
    activeCompany,
    canSwitchCompany: (query.data?.accessibleCompanies.length ?? 0) > 1,
  };
}
