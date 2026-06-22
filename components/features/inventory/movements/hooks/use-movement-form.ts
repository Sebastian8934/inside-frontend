"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMovementMutations } from "@/components/features/inventory/movements/hooks/use-movement-mutations";
import {
  movementDefaultValues,
  movementSchema,
  movementToFormValues,
  type MovementFormValues,
} from "@/components/features/inventory/movements/schemas/movement.schema";
import type { InventoryMovement } from "@/types/inventory";

type UseMovementFormOptions = {
  open: boolean;
  movement?: InventoryMovement | null;
  companyId: number | null;
  defaultDate: string;
  onSuccess?: () => void;
};

export function useMovementForm({
  open,
  movement,
  companyId,
  defaultDate,
  onSuccess,
}: UseMovementFormOptions) {
  const { createMovement, updateMovement } = useMovementMutations(companyId);

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      ...movementDefaultValues,
      operationDate: defaultDate,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (movement) {
      form.reset(movementToFormValues(movement, defaultDate));
      return;
    }

    form.reset({
      ...movementDefaultValues,
      operationDate: defaultDate,
    });
  }, [open, movement, defaultDate, form]);

  async function handleSubmit(values: MovementFormValues) {
    if (movement) {
      await updateMovement.mutateAsync({ id: movement.id, values });
    } else {
      await createMovement.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(movement),
    isSubmitting: form.formState.isSubmitting,
  };
}
