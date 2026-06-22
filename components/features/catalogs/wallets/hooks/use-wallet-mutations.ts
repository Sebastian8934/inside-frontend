"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createWallet,
  updateWallet,
} from "@/components/features/catalogs/wallets/api/wallets.api";
import type { WalletFormValues } from "@/components/features/catalogs/wallets/schemas/wallet.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

function toCreatePayload(values: WalletFormValues, companyId: number) {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    asset: values.asset.trim(),
    network: values.network.trim(),
    walletType: values.walletType.trim(),
    address: values.address?.trim() || null,
    platformId: values.platformId ?? null,
    usageDescription: values.usageDescription?.trim() || null,
    referenceBalanceUsdt: values.referenceBalanceUsdt || 0,
    companyId,
  };
}

function toUpdatePayload(values: WalletFormValues) {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    asset: values.asset.trim(),
    network: values.network.trim(),
    walletType: values.walletType.trim(),
    address: values.address?.trim() || null,
    platformId: values.platformId ?? null,
    usageDescription: values.usageDescription?.trim() || null,
    referenceBalanceUsdt: values.referenceBalanceUsdt || 0,
    isActive: values.isActive ?? true,
  };
}

export function useWalletMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["wallets"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: WalletFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createWallet(toCreatePayload(values, companyId));
    },
    onSuccess: () => {
      toast.success("Wallet creada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: WalletFormValues;
    }) => updateWallet(id, toUpdatePayload(values), companyId),
    onSuccess: () => {
      toast.success("Wallet actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createWallet: createMutation,
    updateWallet: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
