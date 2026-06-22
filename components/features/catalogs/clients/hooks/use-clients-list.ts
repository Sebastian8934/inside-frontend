"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/components/features/catalogs/clients/api/clients.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useClientsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchClients(companyId),
    enabled: Boolean(companyId),
  });
}
