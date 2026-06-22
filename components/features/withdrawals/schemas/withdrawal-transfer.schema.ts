import { z } from "zod";
import { WITHDRAWAL_TRANSFER_TYPES } from "@/types/withdrawals";
import type { WithdrawalTransfer } from "@/types/withdrawals";

export const withdrawalTransferSchema = z.object({
  withdrawalCompanyId: z.number().positive("Seleccione una empresa"),
  amountCop: z.number().positive("Monto requerido"),
  transferType: z.enum(WITHDRAWAL_TRANSFER_TYPES),
});

export type WithdrawalTransferFormValues = z.infer<
  typeof withdrawalTransferSchema
>;

export function withdrawalTransferDefaultValues(
  defaultCompanyId?: number,
): WithdrawalTransferFormValues {
  return {
    withdrawalCompanyId: defaultCompanyId ?? 0,
    amountCop: 0,
    transferType: WITHDRAWAL_TRANSFER_TYPES[0],
  };
}

export function withdrawalTransferToFormValues(
  transfer: WithdrawalTransfer,
): WithdrawalTransferFormValues {
  return {
    withdrawalCompanyId: transfer.withdrawalCompanyId,
    amountCop: transfer.amountCop,
    transferType: transfer.transferType as WithdrawalTransferFormValues["transferType"],
  };
}
