"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import {
  cashOutExpenseDefaultValues,
  cashOutExpenseSchema,
  cashOutExpenseToFormValues,
  type CashOutExpenseFormValues,
} from "@/components/features/cash-out/schemas/cash-out-expense.schema";
import type { CashOutExpenseListItem } from "@/types/cash-out";

type UseCashOutExpenseFormOptions = {
  open: boolean;
  expense?: CashOutExpenseListItem | null;
  companyId: number | null;
  defaultDate: string;
  onSuccess?: () => void;
};

export function useCashOutExpenseForm({
  open,
  expense,
  companyId,
  defaultDate,
  onSuccess,
}: UseCashOutExpenseFormOptions) {
  const { createExpense, updateExpense } = useCashOutMutations(companyId);

  const form = useForm<CashOutExpenseFormValues>({
    resolver: zodResolver(cashOutExpenseSchema),
    defaultValues: {
      ...cashOutExpenseDefaultValues,
      expenseDate: defaultDate,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (expense) {
      form.reset(cashOutExpenseToFormValues(expense));
      return;
    }

    form.reset({
      ...cashOutExpenseDefaultValues,
      expenseDate: defaultDate,
    });
  }, [open, expense, defaultDate, form]);

  async function handleSubmit(values: CashOutExpenseFormValues) {
    if (expense) {
      await updateExpense.mutateAsync({ id: expense.id, values });
    } else {
      await createExpense.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(expense),
    isSubmitting: form.formState.isSubmitting,
  };
}
