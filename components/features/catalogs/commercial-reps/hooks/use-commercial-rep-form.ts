"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCommercialRepMutations } from "@/components/features/catalogs/commercial-reps/hooks/use-commercial-rep-mutations";
import {
  commercialRepDefaultValues,
  commercialRepSchema,
  commercialRepToFormValues,
  type CommercialRepFormValues,
} from "@/components/features/catalogs/commercial-reps/schemas/commercial-rep.schema";
import type { CommercialRep } from "@/types/catalogs";

type UseCommercialRepFormOptions = {
  open: boolean;
  rep?: CommercialRep | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useCommercialRepForm({
  open,
  rep,
  companyId,
  onSuccess,
}: UseCommercialRepFormOptions) {
  const { createCommercialRep, updateCommercialRep } =
    useCommercialRepMutations(companyId);

  const form = useForm<CommercialRepFormValues>({
    resolver: zodResolver(commercialRepSchema),
    defaultValues: commercialRepDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (rep) {
      form.reset(commercialRepToFormValues(rep));
      return;
    }

    form.reset(commercialRepDefaultValues);
  }, [open, rep, form]);

  async function handleSubmit(values: CommercialRepFormValues) {
    if (rep) {
      await updateCommercialRep.mutateAsync({ id: rep.id, values });
    } else {
      await createCommercialRep.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(rep),
    isSubmitting: form.formState.isSubmitting,
  };
}
