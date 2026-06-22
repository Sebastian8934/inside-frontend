"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRolesApi } from "@/components/features/users/api/users.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useRolesList() {
  return useQuery({
    queryKey: queryKeys.roles.all,
    queryFn: fetchRolesApi,
  });
}
