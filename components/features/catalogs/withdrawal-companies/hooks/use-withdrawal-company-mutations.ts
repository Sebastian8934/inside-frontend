"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createWithdrawalCompany,
  updateWithdrawalCompany,
} from "@/components/features/catalogs/withdrawal-companies/api/withdrawal-companies.api";
import type { WithdrawalCompanyFormValues } from "@/components/features/catalogs/withdrawal-companies/schemas/withdrawal-company.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

export function useWithdrawalCompanyMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.root });
  };

  const createMutation = useMutation({
    mutationFn: (values: WithdrawalCompanyFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createWithdrawalCompany({
        name: values.name.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Empresa de retiro creada.");
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
      values: WithdrawalCompanyFormValues;
    }) =>
      updateWithdrawalCompany(
        id,
        {
          name: values.name.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Empresa de retiro actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createWithdrawalCompany: createMutation,
    updateWithdrawalCompany: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
