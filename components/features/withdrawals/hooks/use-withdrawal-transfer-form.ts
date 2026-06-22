"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWithdrawalTransferMutations } from "@/components/features/withdrawals/hooks/use-withdrawal-mutations";
import {
  withdrawalTransferDefaultValues,
  withdrawalTransferSchema,
  withdrawalTransferToFormValues,
  type WithdrawalTransferFormValues,
} from "@/components/features/withdrawals/schemas/withdrawal-transfer.schema";
import type { WithdrawalTransfer } from "@/types/withdrawals";

type Options = {
  open: boolean;
  transfer?: WithdrawalTransfer | null;
  dayId: number;
  companyId: number | null;
  defaultCompanyId?: number;
  onSuccess?: () => void;
};

export function useWithdrawalTransferForm({
  open,
  transfer,
  dayId,
  companyId,
  defaultCompanyId,
  onSuccess,
}: Options) {
  const { saveTransfer } = useWithdrawalTransferMutations(companyId);

  const form = useForm<WithdrawalTransferFormValues>({
    resolver: zodResolver(withdrawalTransferSchema),
    defaultValues: withdrawalTransferDefaultValues(defaultCompanyId),
  });

  useEffect(() => {
    if (!open) return;

    if (transfer) {
      form.reset(withdrawalTransferToFormValues(transfer));
      return;
    }

    form.reset(withdrawalTransferDefaultValues(defaultCompanyId));
  }, [open, transfer, defaultCompanyId, form]);

  async function handleSubmit(values: WithdrawalTransferFormValues) {
    await saveTransfer.mutateAsync({
      dayId,
      transferId: transfer?.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(transfer),
    isSubmitting: saveTransfer.isPending,
  };
}
