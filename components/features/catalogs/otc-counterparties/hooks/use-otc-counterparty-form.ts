"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useOtcCounterpartyMutations } from "@/components/features/catalogs/otc-counterparties/hooks/use-otc-counterparty-mutations";
import {
  otcCounterpartyDefaultValues,
  otcCounterpartySchema,
  otcCounterpartyToFormValues,
  type OtcCounterpartyFormValues,
} from "@/components/features/catalogs/otc-counterparties/schemas/otc-counterparty.schema";
import type { OtcCounterparty } from "@/types/catalogs";

type UseOtcCounterpartyFormOptions = {
  open: boolean;
  counterparty?: OtcCounterparty | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useOtcCounterpartyForm({
  open,
  counterparty,
  companyId,
  onSuccess,
}: UseOtcCounterpartyFormOptions) {
  const { createOtcCounterparty, updateOtcCounterparty } =
    useOtcCounterpartyMutations(companyId);

  const form = useForm<OtcCounterpartyFormValues>({
    resolver: zodResolver(otcCounterpartySchema),
    defaultValues: otcCounterpartyDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (counterparty) {
      form.reset(otcCounterpartyToFormValues(counterparty));
      return;
    }

    form.reset(otcCounterpartyDefaultValues);
  }, [open, counterparty, form]);

  async function handleSubmit(values: OtcCounterpartyFormValues) {
    if (counterparty) {
      await updateOtcCounterparty.mutateAsync({ id: counterparty.id, values });
    } else {
      await createOtcCounterparty.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(counterparty),
    isSubmitting: form.formState.isSubmitting,
  };
}
