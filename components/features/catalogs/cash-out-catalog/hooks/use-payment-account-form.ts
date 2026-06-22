"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePaymentAccountMutations } from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-catalog-mutations";
import {
  paymentAccountDefaultValues,
  paymentAccountSchema,
  paymentAccountToFormValues,
  type PaymentAccountFormValues,
} from "@/components/features/catalogs/cash-out-catalog/schemas/cash-out-catalog.schema";
import type { PaymentAccount } from "@/types/cash-out";

type UsePaymentAccountFormOptions = {
  open: boolean;
  account?: PaymentAccount | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function usePaymentAccountForm({
  open,
  account,
  companyId,
  onSuccess,
}: UsePaymentAccountFormOptions) {
  const { createAccount, updateAccount } = usePaymentAccountMutations(companyId);

  const form = useForm<PaymentAccountFormValues>({
    resolver: zodResolver(paymentAccountSchema),
    defaultValues: paymentAccountDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (account) {
      form.reset(paymentAccountToFormValues(account));
      return;
    }

    form.reset(paymentAccountDefaultValues);
  }, [open, account, form]);

  async function handleSubmit(values: PaymentAccountFormValues) {
    if (account) {
      await updateAccount.mutateAsync({ id: account.id, values });
    } else {
      await createAccount.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(account),
    isSubmitting: form.formState.isSubmitting,
  };
}
