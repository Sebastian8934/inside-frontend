import { z } from "zod";
import { DELIVERY_MOVEMENT_TYPES } from "@/types/delivery";

export const deliveryMovementSchema = z.object({
  operationDate: z.string().min(1, "La fecha es requerida"),
  clientId: z.number().positive("Seleccione un cliente"),
  movementType: z.enum(DELIVERY_MOVEMENT_TYPES),
  concept: z.string().trim().min(1, "El concepto es requerido").max(200),
  totalCop: z
    .number({ error: "Total COP requerido" })
    .refine((v) => v !== 0, "Total COP no puede ser 0"),
  referenceKey: z.string().trim().min(1, "La referencia es requerida").max(50),
  comment: z.string().max(500).nullable().optional(),
});

export type DeliveryMovementFormValues = z.infer<typeof deliveryMovementSchema>;

export const deliveryMovementDefaultValues: DeliveryMovementFormValues = {
  operationDate: "",
  clientId: 0,
  movementType: DELIVERY_MOVEMENT_TYPES[0],
  concept: "",
  totalCop: 0,
  referenceKey: "",
  comment: "",
};

export function deliveryMovementToFormValues(
  movement: {
    operationDate: string;
    clientId: number;
    movementType: string;
    concept: string;
    totalCop: number;
    referenceKey: string;
    comment?: string | null;
  },
  defaultDate: string,
): DeliveryMovementFormValues {
  return {
    operationDate: movement.operationDate ?? defaultDate,
    clientId: movement.clientId,
    movementType: movement.movementType as DeliveryMovementFormValues["movementType"],
    concept: movement.concept,
    totalCop: movement.totalCop,
    referenceKey: movement.referenceKey,
    comment: movement.comment ?? "",
  };
}
