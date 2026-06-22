"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNegotiationLineMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import {
  negotiationLineDefaultValues,
  negotiationLineSchema,
  negotiationLineToFormValues,
  type NegotiationLineFormValues,
} from "@/components/features/negotiations/schemas/negotiation-line.schema";
import type { NegotiationLine } from "@/types/negotiations";

type Options = {
  open: boolean;
  line?: NegotiationLine | null;
  dayId: number;
  companyId: number | null;
  nextLineNumber: number;
  onSuccess?: () => void;
};

export function useNegotiationLineForm({
  open,
  line,
  dayId,
  companyId,
  nextLineNumber,
  onSuccess,
}: Options) {
  const { saveLine } = useNegotiationLineMutations(companyId);

  const form = useForm<NegotiationLineFormValues>({
    resolver: zodResolver(negotiationLineSchema),
    defaultValues: negotiationLineDefaultValues(nextLineNumber),
  });

  useEffect(() => {
    if (!open) return;

    if (line) {
      form.reset(negotiationLineToFormValues(line));
      return;
    }

    form.reset(negotiationLineDefaultValues(nextLineNumber));
  }, [open, line, nextLineNumber, form]);

  async function handleSubmit(values: NegotiationLineFormValues) {
    await saveLine.mutateAsync({
      dayId,
      lineId: line?.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(line),
    isSubmitting: saveLine.isPending,
  };
}
