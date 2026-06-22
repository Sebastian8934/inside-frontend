"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPlatforms,
  fetchWalletById,
  fetchWallets,
} from "@/components/features/catalogs/wallets/api/wallets.api";
import { queryKeys } from "@/lib/query/query-keys";

export function useWalletsList(companyId: number | null) {
  return useQuery({
    queryKey: queryKeys.wallets.all({ companyId, activeOnly: false }),
    queryFn: () => fetchWallets(companyId, false),
    enabled: Boolean(companyId),
  });
}

export function useWalletDetail(
  walletId: number | null | undefined,
  companyId: number | null,
  open: boolean,
) {
  return useQuery({
    queryKey: queryKeys.wallets.detail(walletId ?? 0),
    queryFn: () => fetchWalletById(walletId!, companyId),
    enabled: open && Boolean(walletId && companyId),
  });
}

export function useWalletPlatforms(companyId: number | null, open: boolean) {
  return useQuery({
    queryKey: queryKeys.platforms.all({ companyId }),
    queryFn: () => fetchPlatforms(companyId),
    enabled: open && Boolean(companyId),
  });
}
