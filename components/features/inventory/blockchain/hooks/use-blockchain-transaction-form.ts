"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBlockchainMutations } from "@/components/features/inventory/blockchain/hooks/use-blockchain-mutations";
import {
  blockchainTransactionDefaultValues,
  blockchainTransactionSchema,
  type BlockchainTransactionFormValues,
} from "@/components/features/inventory/blockchain/schemas/blockchain.schema";

type UseBlockchainTransactionFormOptions = {
  open: boolean;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useBlockchainTransactionForm({
  open,
  companyId,
  onSuccess,
}: UseBlockchainTransactionFormOptions) {
  const { createTransaction } = useBlockchainMutations(companyId);

  const form = useForm<BlockchainTransactionFormValues>({
    resolver: zodResolver(blockchainTransactionSchema),
    defaultValues: blockchainTransactionDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(blockchainTransactionDefaultValues);
  }, [open, form]);

  async function handleSubmit(values: BlockchainTransactionFormValues) {
    await createTransaction.mutateAsync(values);
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || createTransaction.isPending,
  };
}
