"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import {
  cashOutPayrollDefaultValues,
  cashOutPayrollSchema,
  cashOutPayrollToFormValues,
  type CashOutPayrollFormValues,
} from "@/components/features/cash-out/schemas/cash-out-payroll.schema";
import type { PayrollEntry } from "@/types/cash-out";

type UseCashOutPayrollFormOptions = {
  open: boolean;
  entry?: PayrollEntry | null;
  companyId: number | null;
  defaultPeriod: { periodMonth: number; periodYear: number };
  onSuccess?: () => void;
};

export function useCashOutPayrollForm({
  open,
  entry,
  companyId,
  defaultPeriod,
  onSuccess,
}: UseCashOutPayrollFormOptions) {
  const { createPayroll, updatePayroll } = useCashOutMutations(companyId);

  const form = useForm<CashOutPayrollFormValues>({
    resolver: zodResolver(cashOutPayrollSchema),
    defaultValues: cashOutPayrollDefaultValues(
      defaultPeriod.periodMonth,
      defaultPeriod.periodYear,
    ),
  });

  useEffect(() => {
    if (!open) return;

    if (entry) {
      form.reset(cashOutPayrollToFormValues(entry));
      return;
    }

    form.reset(
      cashOutPayrollDefaultValues(
        defaultPeriod.periodMonth,
        defaultPeriod.periodYear,
      ),
    );
  }, [open, entry, defaultPeriod, form]);

  async function handleSubmit(values: CashOutPayrollFormValues) {
    if (entry) {
      await updatePayroll.mutateAsync({ id: entry.id, values });
    } else {
      await createPayroll.mutateAsync(values);
    }

    onSuccess?.();
  }

  const totalCop =
    (form.watch("baseSalaryCop") || 0) + (form.watch("bonusCop") || 0);

  return {
    form,
    handleSubmit,
    totalCop,
    isEditing: Boolean(entry),
    isSubmitting: form.formState.isSubmitting,
  };
}
