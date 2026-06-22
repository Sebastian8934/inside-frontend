import { z } from "zod";
import type { WithdrawalSlot } from "@/types/withdrawals";

export const withdrawalCompanyLineSchema = z.object({
  clientId: z.number().nullable().optional(),
  slots: z.array(
    z.object({
      slotIndex: z.number(),
      amountCop: z.number().min(0),
      isActive: z.boolean(),
    }),
  ),
});

export type WithdrawalCompanyLineFormValues = z.infer<
  typeof withdrawalCompanyLineSchema
>;

export function withdrawalCompanyLineToFormValues(
  clientId: number | null,
  slots: WithdrawalSlot[],
): WithdrawalCompanyLineFormValues {
  return {
    clientId: clientId ?? null,
    slots: slots.map((slot) => ({ ...slot })),
  };
}
