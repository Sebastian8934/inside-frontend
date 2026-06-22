"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDeliveryMovementApi,
  updateDeliveryMovementApi,
} from "@/components/features/delivery/api/delivery.api";
import {
  toCreateDeliveryMovementPayload,
  toUpdateDeliveryMovementPayload,
} from "@/components/features/delivery/lib/map-delivery-movement-payload";
import type { DeliveryMovementFormValues } from "@/components/features/delivery/schemas/delivery-movement.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useDeliveryMovementMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["delivery"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: DeliveryMovementFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createDeliveryMovementApi(
        toCreateDeliveryMovementPayload(values, companyId),
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
      values: DeliveryMovementFormValues;
    }) =>
      updateDeliveryMovementApi(
        id,
        toUpdateDeliveryMovementPayload(values),
        companyId,
      ),
    onSuccess: () => {
      toast.success("Movimiento actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createMovement: createMutation,
    updateMovement: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
