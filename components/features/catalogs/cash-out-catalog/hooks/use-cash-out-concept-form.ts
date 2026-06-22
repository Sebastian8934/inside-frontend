"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCashOutConceptMutations } from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-catalog-mutations";
import {
  cashOutConceptDefaultValues,
  cashOutConceptSchema,
  cashOutConceptToFormValues,
  type CashOutConceptFormValues,
} from "@/components/features/catalogs/cash-out-catalog/schemas/cash-out-catalog.schema";
import type { CashOutConcept } from "@/types/cash-out";

type UseCashOutConceptFormOptions = {
  open: boolean;
  concept?: CashOutConcept | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useCashOutConceptForm({
  open,
  concept,
  companyId,
  onSuccess,
}: UseCashOutConceptFormOptions) {
  const { createConcept, updateConcept } = useCashOutConceptMutations(companyId);

  const form = useForm<CashOutConceptFormValues>({
    resolver: zodResolver(cashOutConceptSchema),
    defaultValues: cashOutConceptDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (concept) {
      form.reset(cashOutConceptToFormValues(concept));
      return;
    }

    form.reset(cashOutConceptDefaultValues);
  }, [open, concept, form]);

  async function handleSubmit(values: CashOutConceptFormValues) {
    if (concept) {
      await updateConcept.mutateAsync({ id: concept.id, values });
    } else {
      await createConcept.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(concept),
    isSubmitting: form.formState.isSubmitting,
  };
}
