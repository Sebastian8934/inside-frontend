"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBlockchainMutations } from "@/components/features/inventory/blockchain/hooks/use-blockchain-mutations";
import {
  blockchainMatchDefaultValues,
  blockchainMatchSchema,
  type BlockchainMatchFormValues,
} from "@/components/features/inventory/blockchain/schemas/blockchain.schema";

type UseBlockchainMatchFormOptions = {
  open: boolean;
  transactionId: number | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useBlockchainMatchForm({
  open,
  transactionId,
  companyId,
  onSuccess,
}: UseBlockchainMatchFormOptions) {
  const { matchTransaction } = useBlockchainMutations(companyId);

  const form = useForm<BlockchainMatchFormValues>({
    resolver: zodResolver(blockchainMatchSchema),
    defaultValues: blockchainMatchDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(blockchainMatchDefaultValues);
  }, [open, form]);

  async function handleSubmit(values: BlockchainMatchFormValues) {
    if (!transactionId) return;

    await matchTransaction.mutateAsync({ transactionId, values });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || matchTransaction.isPending,
  };
}
