"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccountHolderMutations } from "@/components/features/banking/hooks/use-account-holder-mutations";
import {
  accountHolderDefaultValues,
  accountHolderSchema,
  accountHolderToFormValues,
  type AccountHolderFormValues,
} from "@/components/features/banking/schemas/banking.schema";
import type { AccountHolder } from "@/types/banking";

type UseAccountHolderFormOptions = {
  open: boolean;
  holder?: AccountHolder | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useAccountHolderForm({
  open,
  holder,
  companyId,
  onSuccess,
}: UseAccountHolderFormOptions) {
  const { createHolder, updateHolder } = useAccountHolderMutations(companyId);

  const form = useForm<AccountHolderFormValues>({
    resolver: zodResolver(accountHolderSchema),
    defaultValues: accountHolderDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (holder) {
      form.reset(accountHolderToFormValues(holder));
      return;
    }

    form.reset(accountHolderDefaultValues);
  }, [open, holder, form]);

  async function handleSubmit(values: AccountHolderFormValues) {
    if (holder) {
      await updateHolder.mutateAsync({ id: holder.id, values });
    } else {
      await createHolder.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(holder),
    isSubmitting: form.formState.isSubmitting,
  };
}
