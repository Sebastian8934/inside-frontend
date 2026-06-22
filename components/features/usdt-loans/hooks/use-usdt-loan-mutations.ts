"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateUsdtLoanApi,
  upsertUsdtLoanApi,
} from "@/components/features/usdt-loans/api/usdt-loans.api";
import {
  toUpdateUsdtLoanPayload,
  toUpsertUsdtLoanPayload,
} from "@/components/features/usdt-loans/lib/map-usdt-loan-payload";
import type {
  CreateUsdtLoanFormValues,
  UsdtLoanFormValues,
} from "@/components/features/usdt-loans/schemas/usdt-loan.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useUsdtLoanMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["usdt-loans"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CreateUsdtLoanFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return upsertUsdtLoanApi(toUpsertUsdtLoanPayload(values, companyId));
    },
    onSuccess: () => {
      toast.success("Préstamo guardado.");
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
      values: UsdtLoanFormValues;
    }) =>
      updateUsdtLoanApi(id, toUpdateUsdtLoanPayload(values), companyId),
    onSuccess: () => {
      toast.success("Préstamo actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createLoan: createMutation,
    updateLoan: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
