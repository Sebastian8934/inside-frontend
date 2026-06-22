"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUsdtLoanMutations } from "@/components/features/usdt-loans/hooks/use-usdt-loan-mutations";
import {
  createUsdtLoanSchema,
  usdtLoanDefaultValues,
  usdtLoanSchema,
  usdtLoanToFormValues,
  type CreateUsdtLoanFormValues,
  type UsdtLoanFormValues,
} from "@/components/features/usdt-loans/schemas/usdt-loan.schema";
import type { UsdtLoan } from "@/types/usdt-loans";

type UseUsdtLoanFormOptions = {
  open: boolean;
  loan?: UsdtLoan | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useUsdtLoanForm({
  open,
  loan,
  companyId,
  onSuccess,
}: UseUsdtLoanFormOptions) {
  const { createLoan, updateLoan } = useUsdtLoanMutations(companyId);
  const isEditing = Boolean(loan);

  const form = useForm<CreateUsdtLoanFormValues | UsdtLoanFormValues>({
    resolver: zodResolver(isEditing ? usdtLoanSchema : createUsdtLoanSchema),
    defaultValues: usdtLoanDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (loan) {
      form.reset(usdtLoanToFormValues(loan));
      return;
    }

    form.reset(usdtLoanDefaultValues);
  }, [open, loan, form]);

  async function handleSubmit(
    values: CreateUsdtLoanFormValues | UsdtLoanFormValues,
  ) {
    if (loan) {
      await updateLoan.mutateAsync({ id: loan.id, values });
    } else {
      await createLoan.mutateAsync(values as CreateUsdtLoanFormValues);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing,
    isSubmitting: form.formState.isSubmitting,
    pendingUsdt:
      (form.watch("lentUsdt") || 0) - (form.watch("returnedUsdt") || 0),
  };
}
