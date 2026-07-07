"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsersApi } from "@/components/features/users/api/users.api";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { queryKeys } from "@/lib/query/query-keys";

export function useUsersList() {
  const enabled = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchUsersApi,
    enabled,
  });
}
