"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import {
  cashOutTransactionCostDefaultValues,
  cashOutTransactionCostSchema,
  cashOutTransactionCostToFormValues,
  type CashOutTransactionCostFormValues,
} from "@/components/features/cash-out/schemas/cash-out-transaction-cost.schema";
import type { CashOutTransactionCost } from "@/types/cash-out";

type UseCashOutTransactionCostFormOptions = {
  open: boolean;
  cost?: CashOutTransactionCost | null;
  companyId: number | null;
  defaultDate: string;
  onSuccess?: () => void;
};

export function useCashOutTransactionCostForm({
  open,
  cost,
  companyId,
  defaultDate,
  onSuccess,
}: UseCashOutTransactionCostFormOptions) {
  const { createTransactionCost, updateTransactionCost } =
    useCashOutMutations(companyId);

  const form = useForm<CashOutTransactionCostFormValues>({
    resolver: zodResolver(cashOutTransactionCostSchema),
    defaultValues: {
      ...cashOutTransactionCostDefaultValues,
      costDate: defaultDate,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (cost) {
      form.reset(cashOutTransactionCostToFormValues(cost));
      return;
    }

    form.reset({
      ...cashOutTransactionCostDefaultValues,
      costDate: defaultDate,
    });
  }, [open, cost, defaultDate, form]);

  async function handleSubmit(values: CashOutTransactionCostFormValues) {
    if (cost) {
      await updateTransactionCost.mutateAsync({ id: cost.id, values });
    } else {
      await createTransactionCost.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(cost),
    isSubmitting: form.formState.isSubmitting,
  };
}
