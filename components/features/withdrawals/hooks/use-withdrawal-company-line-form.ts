"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWithdrawalCompanyLineMutations } from "@/components/features/withdrawals/hooks/use-withdrawal-mutations";
import {
  withdrawalCompanyLineSchema,
  withdrawalCompanyLineToFormValues,
  type WithdrawalCompanyLineFormValues,
} from "@/components/features/withdrawals/schemas/withdrawal-company-line.schema";
import type {
  WithdrawalCompany,
  WithdrawalCompanyLine,
} from "@/types/withdrawals";
import { emptyWithdrawalSlots } from "@/types/withdrawals";

type LineContext = {
  company: WithdrawalCompany;
  line: WithdrawalCompanyLine;
};

type Options = {
  open: boolean;
  line?: LineContext | null;
  dayId: number;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useWithdrawalCompanyLineForm({
  open,
  line,
  dayId,
  companyId,
  onSuccess,
}: Options) {
  const { upsertLine } = useWithdrawalCompanyLineMutations(companyId);

  const form = useForm<WithdrawalCompanyLineFormValues>({
    resolver: zodResolver(withdrawalCompanyLineSchema),
    defaultValues: {
      clientId: null,
      slots: emptyWithdrawalSlots(),
    },
  });

  useEffect(() => {
    if (!open || !line) return;

    form.reset(
      withdrawalCompanyLineToFormValues(line.line.clientId, line.line.slots),
    );
  }, [open, line, form]);

  async function handleSubmit(values: WithdrawalCompanyLineFormValues) {
    if (!line) return;

    await upsertLine.mutateAsync({
      dayId,
      withdrawalCompanyId: line.company.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isSubmitting: upsertLine.isPending,
  };
}
