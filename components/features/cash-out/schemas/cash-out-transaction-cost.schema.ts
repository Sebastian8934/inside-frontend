import { z } from "zod";
import type { CashOutTransactionCost } from "@/types/cash-out";

export const cashOutTransactionCostSchema = z.object({
  costDate: z.string().min(1, "Fecha requerida"),
  operationalGroup: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  amountCop: z.number().nullable().optional(),
  costPercentage: z.number().nullable().optional(),
  comment: z.string().nullable().optional(),
});

export type CashOutTransactionCostFormValues = z.infer<
  typeof cashOutTransactionCostSchema
>;

export const cashOutTransactionCostDefaultValues: CashOutTransactionCostFormValues =
  {
    costDate: "",
    operationalGroup: "",
    description: "",
    amountCop: null,
    costPercentage: null,
    comment: "",
  };

export function cashOutTransactionCostToFormValues(
  cost: CashOutTransactionCost,
): CashOutTransactionCostFormValues {
  return {
    costDate: cost.costDate,
    operationalGroup: cost.operationalGroup ?? "",
    description: cost.description ?? "",
    amountCop: cost.amountCop ?? null,
    costPercentage: cost.costPercentage ?? null,
    comment: cost.comment ?? "",
  };
}
