"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAccountHolderApi,
  updateAccountHolderApi,
} from "@/components/features/banking/api/banking.api";
import type { AccountHolderFormValues } from "@/components/features/banking/schemas/banking.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useAccountHolderMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["banking"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: AccountHolderFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createAccountHolderApi({
        name: values.name.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Titular creado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: AccountHolderFormValues;
    }) =>
      updateAccountHolderApi(
        id,
        { name: values.name.trim(), isActive: values.isActive },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Titular actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createHolder: createMutation,
    updateHolder: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
