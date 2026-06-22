"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNegotiationDayMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import {
  negotiationDaySchema,
  negotiationDayToFormValues,
  type NegotiationDayFormValues,
} from "@/components/features/negotiations/schemas/negotiation-day.schema";
import type { DailyNegotiationDetail } from "@/types/negotiations";

type Options = {
  day: DailyNegotiationDetail;
  companyId: number | null;
};

export function useNegotiationDayForm({ day, companyId }: Options) {
  const { updateDay, closeDay } = useNegotiationDayMutations(companyId);

  const form = useForm<NegotiationDayFormValues>({
    resolver: zodResolver(negotiationDaySchema),
    defaultValues: negotiationDayToFormValues(day),
  });

  useEffect(() => {
    form.reset(negotiationDayToFormValues(day));
  }, [day, form]);

  async function handleSave(values: NegotiationDayFormValues) {
    await updateDay.mutateAsync({ dayId: day.id, values });
  }

  async function handleClose() {
    await closeDay.mutateAsync(day.id);
  }

  return {
    form,
    handleSave,
    handleClose,
    isSaving: updateDay.isPending,
    isClosing: closeDay.isPending,
  };
}
