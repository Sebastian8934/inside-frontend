"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCashOutGroupMutations } from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-catalog-mutations";
import {
  cashOutGroupDefaultValues,
  cashOutGroupSchema,
  cashOutGroupToFormValues,
  type CashOutGroupFormValues,
} from "@/components/features/catalogs/cash-out-catalog/schemas/cash-out-catalog.schema";
import type { CashOutGroup } from "@/types/cash-out";

type UseCashOutGroupFormOptions = {
  open: boolean;
  group?: CashOutGroup | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useCashOutGroupForm({
  open,
  group,
  companyId,
  onSuccess,
}: UseCashOutGroupFormOptions) {
  const { createGroup, updateGroup } = useCashOutGroupMutations(companyId);

  const form = useForm<CashOutGroupFormValues>({
    resolver: zodResolver(cashOutGroupSchema),
    defaultValues: cashOutGroupDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (group) {
      form.reset(cashOutGroupToFormValues(group));
      return;
    }

    form.reset(cashOutGroupDefaultValues);
  }, [open, group, form]);

  async function handleSubmit(values: CashOutGroupFormValues) {
    if (group) {
      await updateGroup.mutateAsync({ id: group.id, values });
    } else {
      await createGroup.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(group),
    isSubmitting: form.formState.isSubmitting,
  };
}
