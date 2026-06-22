"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNegotiationScenarioMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import {
  negotiationScenarioDefaultValues,
  negotiationScenarioSchema,
  negotiationScenarioToFormValues,
  type NegotiationScenarioFormValues,
} from "@/components/features/negotiations/schemas/negotiation-scenario.schema";
import type { NegotiationRateScenario } from "@/types/negotiations";

type Options = {
  open: boolean;
  scenario?: NegotiationRateScenario | null;
  dayId: number;
  companyId: number | null;
  nextSortOrder: number;
  onSuccess?: () => void;
};

export function useNegotiationScenarioForm({
  open,
  scenario,
  dayId,
  companyId,
  nextSortOrder,
  onSuccess,
}: Options) {
  const { saveScenario } = useNegotiationScenarioMutations(companyId);

  const form = useForm<NegotiationScenarioFormValues>({
    resolver: zodResolver(negotiationScenarioSchema),
    defaultValues: negotiationScenarioDefaultValues(nextSortOrder),
  });

  useEffect(() => {
    if (!open) return;

    if (scenario) {
      form.reset(negotiationScenarioToFormValues(scenario));
      return;
    }

    form.reset(negotiationScenarioDefaultValues(nextSortOrder));
  }, [open, scenario, nextSortOrder, form]);

  async function handleSubmit(values: NegotiationScenarioFormValues) {
    await saveScenario.mutateAsync({
      dayId,
      scenarioId: scenario?.id,
      values,
    });
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(scenario),
    isSubmitting: saveScenario.isPending,
  };
}
