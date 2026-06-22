import type { BankMovementFormValues } from "@/components/features/banking/schemas/banking.schema";
import type {
  CreateBankMovementPayload,
  UpdateBankMovementPayload,
} from "@/types/banking";

export function toCreateBankMovementPayload(
  values: BankMovementFormValues,
  companyId: number,
): CreateBankMovementPayload {
  return {
    movementDate: values.movementDate,
    accountHolderId: values.accountHolderId,
    concept: values.concept.trim(),
    amountCop: values.amountCop,
    periodMonth: values.periodMonth,
    periodYear: values.periodYear,
    companyId,
  };
}

export function toUpdateBankMovementPayload(
  values: BankMovementFormValues,
): UpdateBankMovementPayload {
  return {
    movementDate: values.movementDate,
    accountHolderId: values.accountHolderId,
    concept: values.concept.trim(),
    amountCop: values.amountCop,
    periodMonth: values.periodMonth,
    periodYear: values.periodYear,
  };
}
