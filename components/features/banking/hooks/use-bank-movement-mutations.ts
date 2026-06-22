"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBankMovementApi,
  deleteBankMovementApi,
  updateBankMovementApi,
} from "@/components/features/banking/api/banking.api";
import {
  toCreateBankMovementPayload,
  toUpdateBankMovementPayload,
} from "@/components/features/banking/lib/map-bank-movement-payload";
import type { BankMovementFormValues } from "@/components/features/banking/schemas/banking.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useBankMovementMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["banking"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: BankMovementFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createBankMovementApi(
        toCreateBankMovementPayload(values, companyId),
      );
    },
    onSuccess: () => {
      toast.success("Movimiento creado.");
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
      values: BankMovementFormValues;
    }) =>
      updateBankMovementApi(
        id,
        toUpdateBankMovementPayload(values),
        companyId,
      ),
    onSuccess: () => {
      toast.success("Movimiento actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBankMovementApi(id, companyId),
    onSuccess: () => {
      toast.success("Movimiento eliminado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createMovement: createMutation,
    updateMovement: updateMutation,
    deleteMovement: deleteMutation,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
