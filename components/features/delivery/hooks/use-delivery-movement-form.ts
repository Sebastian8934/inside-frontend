"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDeliveryMovementMutations } from "@/components/features/delivery/hooks/use-delivery-movement-mutations";
import {
  deliveryMovementDefaultValues,
  deliveryMovementSchema,
  deliveryMovementToFormValues,
  type DeliveryMovementFormValues,
} from "@/components/features/delivery/schemas/delivery-movement.schema";
import type { DeliveryMovementListItem } from "@/types/delivery";

type UseDeliveryMovementFormOptions = {
  open: boolean;
  movement?: DeliveryMovementListItem | null;
  companyId: number | null;
  defaultDate: string;
  onSuccess?: () => void;
};

export function useDeliveryMovementForm({
  open,
  movement,
  companyId,
  defaultDate,
  onSuccess,
}: UseDeliveryMovementFormOptions) {
  const { createMovement, updateMovement } =
    useDeliveryMovementMutations(companyId);

  const form = useForm<DeliveryMovementFormValues>({
    resolver: zodResolver(deliveryMovementSchema),
    defaultValues: {
      ...deliveryMovementDefaultValues,
      operationDate: defaultDate,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (movement) {
      form.reset(deliveryMovementToFormValues(movement, defaultDate));
      return;
    }

    form.reset({
      ...deliveryMovementDefaultValues,
      operationDate: defaultDate,
    });
  }, [open, movement, defaultDate, form]);

  async function handleSubmit(values: DeliveryMovementFormValues) {
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
