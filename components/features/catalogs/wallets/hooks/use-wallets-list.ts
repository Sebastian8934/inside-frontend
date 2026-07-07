"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPlatforms,
  fetchWalletById,
  fetchWallets,
} from "@/components/features/catalogs/wallets/api/wallets.api";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";

export function useWalletsList(companyId: number | null) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.wallets.all({ companyId, activeOnly: false }),
    queryFn: () => fetchWallets(companyId, false),
    enabled: authReady && Boolean(companyId),
  });
}

export function useWalletDetail(
  walletId: number | null | undefined,
  companyId: number | null,
  open: boolean,
) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.wallets.detail(walletId ?? 0),
    queryFn: () => fetchWalletById(walletId!, companyId),
    enabled: authReady && open && Boolean(walletId && companyId),
  });
}

export function useWalletPlatforms(companyId: number | null, open: boolean) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.platforms.all({ companyId }),
    queryFn: () => fetchPlatforms(companyId),
    enabled: authReady && open && Boolean(companyId),
  });
}
