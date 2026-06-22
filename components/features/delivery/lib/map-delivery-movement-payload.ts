import type { DeliveryMovementFormValues } from "@/components/features/delivery/schemas/delivery-movement.schema";
import type {
  CreateDeliveryMovementPayload,
  UpdateDeliveryMovementPayload,
} from "@/types/delivery";

export function toCreateDeliveryMovementPayload(
  values: DeliveryMovementFormValues,
  companyId: number,
): CreateDeliveryMovementPayload {
  return {
    operationDate: values.operationDate,
    clientId: values.clientId,
    movementType: values.movementType,
    concept: values.concept.trim(),
    totalCop: values.totalCop,
    referenceKey: values.referenceKey.trim(),
    comment: values.comment?.trim() || null,
    companyId,
  };
}

export function toUpdateDeliveryMovementPayload(
  values: DeliveryMovementFormValues,
): UpdateDeliveryMovementPayload {
  return {
    operationDate: values.operationDate,
    clientId: values.clientId,
    movementType: values.movementType,
    concept: values.concept.trim(),
    totalCop: values.totalCop,
    referenceKey: values.referenceKey.trim(),
    comment: values.comment?.trim() || null,
  };
}
