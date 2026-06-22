"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWalletMutations } from "@/components/features/catalogs/wallets/hooks/use-wallet-mutations";
import { useWalletDetail } from "@/components/features/catalogs/wallets/hooks/use-wallets-list";
import {
  walletDefaultValues,
  walletSchema,
  walletToFormValues,
  type WalletFormValues,
} from "@/components/features/catalogs/wallets/schemas/wallet.schema";
import type { Wallet } from "@/types/catalogs";

type UseWalletFormOptions = {
  open: boolean;
  wallet?: Wallet | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useWalletForm({
  open,
  wallet,
  companyId,
  onSuccess,
}: UseWalletFormOptions) {
  const { createWallet, updateWallet } = useWalletMutations(companyId);
  const { data: walletDetail } = useWalletDetail(wallet?.id, companyId, open);

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: walletDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    const source = walletDetail ?? wallet;

    if (source) {
      form.reset(walletToFormValues(source));
      return;
    }

    form.reset(walletDefaultValues);
  }, [open, wallet, walletDetail, form]);

  async function handleSubmit(values: WalletFormValues) {
    if (wallet) {
      await updateWallet.mutateAsync({ id: wallet.id, values });
    } else {
      await createWallet.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(wallet),
    isSubmitting: form.formState.isSubmitting,
  };
}
