"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsersApi } from "@/components/features/users/api/users.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useUsersList() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchUsersApi,
  });
}
