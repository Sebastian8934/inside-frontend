import { z } from "zod";
import type { WithdrawalConsolidatedItem } from "@/types/withdrawals";

export const withdrawalConsolidatedSchema = z.object({
  operationDate: z.string().min(1, "Fecha requerida"),
  withdrawalCompanyId: z.number().positive("Seleccione una empresa"),
  amountCop: z.number().min(0),
  holding: z.string().nullable().optional(),
  periodMonth: z.number().min(1).max(12),
  periodYear: z.number().min(2000),
});

export type WithdrawalConsolidatedFormValues = z.infer<
  typeof withdrawalConsolidatedSchema
>;

export function withdrawalConsolidatedDefaultValues(
  operationDate: string,
  periodMonth: number,
  periodYear: number,
  defaultCompanyId?: number,
): WithdrawalConsolidatedFormValues {
  return {
    operationDate,
    withdrawalCompanyId: defaultCompanyId ?? 0,
    amountCop: 0,
    holding: "",
    periodMonth,
    periodYear,
  };
}

export function withdrawalConsolidatedToFormValues(
  item: WithdrawalConsolidatedItem,
): WithdrawalConsolidatedFormValues {
  return {
    operationDate: item.operationDate,
    withdrawalCompanyId: item.withdrawalCompanyId,
    amountCop: item.amountCop,
    holding: item.holding ?? "",
    periodMonth: item.periodMonth,
    periodYear: item.periodYear,
  };
}
