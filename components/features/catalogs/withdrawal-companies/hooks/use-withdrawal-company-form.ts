"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWithdrawalCompanyMutations } from "@/components/features/catalogs/withdrawal-companies/hooks/use-withdrawal-company-mutations";
import {
  withdrawalCompanyDefaultValues,
  withdrawalCompanySchema,
  withdrawalCompanyToFormValues,
  type WithdrawalCompanyFormValues,
} from "@/components/features/catalogs/withdrawal-companies/schemas/withdrawal-company.schema";
import type { WithdrawalCompany } from "@/types/withdrawals";

type UseWithdrawalCompanyFormOptions = {
  open: boolean;
  company?: WithdrawalCompany | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useWithdrawalCompanyForm({
  open,
  company,
  companyId,
  onSuccess,
}: UseWithdrawalCompanyFormOptions) {
  const { createWithdrawalCompany, updateWithdrawalCompany } =
    useWithdrawalCompanyMutations(companyId);

  const form = useForm<WithdrawalCompanyFormValues>({
    resolver: zodResolver(withdrawalCompanySchema),
    defaultValues: withdrawalCompanyDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (company) {
      form.reset(withdrawalCompanyToFormValues(company));
      return;
    }

    form.reset(withdrawalCompanyDefaultValues);
  }, [open, company, form]);

  async function handleSubmit(values: WithdrawalCompanyFormValues) {
    if (company) {
      await updateWithdrawalCompany.mutateAsync({ id: company.id, values });
    } else {
      await createWithdrawalCompany.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(company),
    isSubmitting: form.formState.isSubmitting,
  };
}
