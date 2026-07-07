"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRolesApi } from "@/components/features/users/api/users.api";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

export function useRolesList() {
  const enabled = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.roles.all,
    queryFn: fetchRolesApi,
    enabled,
  });
}
