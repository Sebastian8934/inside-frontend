"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBankMovementMutations } from "@/components/features/banking/hooks/use-bank-movement-mutations";
import {
  bankMovementSchema,
  bankMovementToFormValues,
  type BankMovementFormValues,
} from "@/components/features/banking/schemas/banking.schema";
import type { BankMovementListItem } from "@/types/banking";
import { getPeriodFromDate } from "@/types/banking";

type UseBankMovementFormOptions = {
  open: boolean;
  movement?: BankMovementListItem | null;
  companyId: number | null;
  defaultDate: string;
  defaultPeriod: { periodMonth: number; periodYear: number };
  onSuccess?: () => void;
};

export function useBankMovementForm({
  open,
  movement,
  companyId,
  defaultDate,
  defaultPeriod,
  onSuccess,
}: UseBankMovementFormOptions) {
  const { createMovement, updateMovement } =
    useBankMovementMutations(companyId);

  const form = useForm<BankMovementFormValues>({
    resolver: zodResolver(bankMovementSchema),
    defaultValues: {
      movementDate: defaultDate,
      accountHolderId: 0,
      concept: "",
      amountCop: 0,
      periodMonth: defaultPeriod.periodMonth,
      periodYear: defaultPeriod.periodYear,
    },
  });

  const movementDate = form.watch("movementDate");

  useEffect(() => {
    if (!open) return;

    if (movement) {
      form.reset(bankMovementToFormValues(movement, defaultDate, defaultPeriod));
      return;
    }

    form.reset({
      movementDate: defaultDate,
      accountHolderId: 0,
      concept: "",
      amountCop: 0,
      periodMonth: defaultPeriod.periodMonth,
      periodYear: defaultPeriod.periodYear,
    });
  }, [open, movement, defaultDate, defaultPeriod, form]);

  useEffect(() => {
    if (!open || movement || !movementDate) return;

    const { periodMonth, periodYear } = getPeriodFromDate(
      new Date(`${movementDate}T12:00:00`),
    );
    form.setValue("periodMonth", periodMonth);
    form.setValue("periodYear", periodYear);
  }, [movementDate, movement, open, form]);

  async function handleSubmit(values: BankMovementFormValues) {
    if (movement) {
      await updateMovement.mutateAsync({ id: movement.id, values });
    } else {
      await createMovement.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(movement),
    isSubmitting: form.formState.isSubmitting,
  };
}
