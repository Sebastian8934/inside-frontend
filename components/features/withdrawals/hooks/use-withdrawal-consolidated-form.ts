"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWithdrawalConsolidatedMutations } from "@/components/features/withdrawals/hooks/use-withdrawal-mutations";
import {
  withdrawalConsolidatedDefaultValues,
  withdrawalConsolidatedSchema,
  withdrawalConsolidatedToFormValues,
  type WithdrawalConsolidatedFormValues,
} from "@/components/features/withdrawals/schemas/withdrawal-consolidated.schema";
import type { WithdrawalConsolidatedItem } from "@/types/withdrawals";

type Options = {
  open: boolean;
  item?: WithdrawalConsolidatedItem | null;
  companyId: number | null;
  operationDate: string;
  periodMonth: number;
  periodYear: number;
  defaultCompanyId?: number;
  onSuccess?: () => void;
};

export function useWithdrawalConsolidatedForm({
  open,
  item,
  companyId,
  operationDate,
  periodMonth,
  periodYear,
  defaultCompanyId,
  onSuccess,
}: Options) {
  const { saveConsolidated } = useWithdrawalConsolidatedMutations(companyId);

  const form = useForm<WithdrawalConsolidatedFormValues>({
    resolver: zodResolver(withdrawalConsolidatedSchema),
    defaultValues: withdrawalConsolidatedDefaultValues(
      operationDate,
      periodMonth,
      periodYear,
      defaultCompanyId,
    ),
  });

  useEffect(() => {
    if (!open) return;

    if (item) {
      form.reset(withdrawalConsolidatedToFormValues(item));
      return;
    }

    form.reset(
      withdrawalConsolidatedDefaultValues(
        operationDate,
        periodMonth,
        periodYear,
        defaultCompanyId,
      ),
    );
  }, [
    open,
    item,
    operationDate,
    periodMonth,
    periodYear,
    defaultCompanyId,
    form,
  ]);

  async function handleSubmit(values: WithdrawalConsolidatedFormValues) {
    await saveConsolidated.mutateAsync({
      itemId: item?.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(item),
    isSubmitting: saveConsolidated.isPending,
  };
}
