"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNegotiationQuotaMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import {
  negotiationQuotaDefaultValues,
  negotiationQuotaSchema,
  negotiationQuotaToFormValues,
  type NegotiationQuotaFormValues,
} from "@/components/features/negotiations/schemas/negotiation-quota.schema";
import type { NegotiationDailyQuota } from "@/types/negotiations";

type Options = {
  open: boolean;
  quota?: NegotiationDailyQuota | null;
  dayId: number;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useNegotiationQuotaForm({
  open,
  quota,
  dayId,
  companyId,
  onSuccess,
}: Options) {
  const { saveQuota } = useNegotiationQuotaMutations(companyId);

  const form = useForm<NegotiationQuotaFormValues>({
    resolver: zodResolver(negotiationQuotaSchema),
    defaultValues: negotiationQuotaDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (quota) {
      form.reset(negotiationQuotaToFormValues(quota));
      return;
    }

    form.reset(negotiationQuotaDefaultValues);
  }, [open, quota, form]);

  async function handleSubmit(values: NegotiationQuotaFormValues) {
    await saveQuota.mutateAsync({
      dayId,
      quotaId: quota?.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(quota),
    isSubmitting: saveQuota.isPending,
  };
}
