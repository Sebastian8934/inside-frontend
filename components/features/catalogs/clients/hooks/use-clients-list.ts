"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/components/features/catalogs/clients/api/clients.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useClientsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchClients(companyId),
    enabled: authReady && Boolean(companyId),
  });
}
