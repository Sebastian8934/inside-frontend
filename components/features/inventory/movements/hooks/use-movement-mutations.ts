"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMovementApi,
  updateMovementApi,
} from "@/components/features/inventory/movements/api/movements.api";
import {
  toCreateMovementPayload,
  toUpdateMovementPayload,
} from "@/components/features/inventory/movements/lib/map-movement-payload";
import type { MovementFormValues } from "@/components/features/inventory/movements/schemas/movement.schema";
import { ApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/query-keys";

export function useMovementMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.root });
  };

  const createMutation = useMutation({
    mutationFn: (values: MovementFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createMovementApi(toCreateMovementPayload(values, companyId));
    },
    onSuccess: () => {
      toast.success("Movimiento creado.");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: MovementFormValues;
    }) => updateMovementApi(id, toUpdateMovementPayload(values), companyId),
    onSuccess: () => {
      toast.success("Movimiento actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    createMovement: createMutation,
    updateMovement: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : "Ocurrió un error inesperado.";
}
