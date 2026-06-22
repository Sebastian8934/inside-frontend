import type { MovementFormValues } from "@/components/features/inventory/movements/schemas/movement.schema";
import type {
  CreateMovementPayload,
  UpdateMovementPayload,
} from "@/types/inventory";

export function toCreateMovementPayload(
  values: MovementFormValues,
  companyId: number,
): CreateMovementPayload {
  return {
    ...values,
    companyId,
    otcCounterpartyId: values.otcCounterpartyId || null,
    walletId: values.walletId || null,
    shipmentNumber: values.shipmentNumber || null,
    txHash: values.txHash || null,
    whatsappGroup: values.whatsappGroup || null,
  };
}

export function toUpdateMovementPayload(
  values: MovementFormValues,
): UpdateMovementPayload {
  return {
    ...values,
    otcCounterpartyId: values.otcCounterpartyId || null,
    walletId: values.walletId || null,
    shipmentNumber: values.shipmentNumber || null,
    txHash: values.txHash || null,
    whatsappGroup: values.whatsappGroup || null,
  };
}
