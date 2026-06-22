import { z } from "zod";
import type { DailyLiquidityCloseDetail } from "@/types/liquidity";

export const liquidityCloseSchema = z.object({
  notes: z.string().nullable().optional(),
});

export type LiquidityCloseFormValues = z.infer<typeof liquidityCloseSchema>;

export function liquidityCloseToFormValues(
  close: DailyLiquidityCloseDetail,
): LiquidityCloseFormValues {
  return {
    notes: close.notes ?? "",
  };
}
