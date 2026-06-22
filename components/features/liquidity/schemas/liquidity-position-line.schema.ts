import { z } from "zod";
import {
  LIQUIDITY_POSITION_CATEGORIES,
} from "@/types/liquidity";
import type { LiquidityPositionLine } from "@/types/liquidity";

export const liquidityPositionLineSchema = z.object({
  category: z.enum(LIQUIDITY_POSITION_CATEGORIES),
  concept: z.string().trim().min(1, "Concepto requerido").max(200),
  amountCop: z.number(),
  sortOrder: z.number(),
});

export type LiquidityPositionLineFormValues = z.infer<
  typeof liquidityPositionLineSchema
>;

export function liquidityPositionLineDefaultValues(
  nextSortOrder: number,
  defaultCategory?: string,
): LiquidityPositionLineFormValues {
  return {
    category:
      (defaultCategory as LiquidityPositionLineFormValues["category"]) ??
      LIQUIDITY_POSITION_CATEGORIES[0],
    concept: "",
    amountCop: 0,
    sortOrder: nextSortOrder,
  };
}

export function liquidityPositionLineToFormValues(
  line: LiquidityPositionLine,
): LiquidityPositionLineFormValues {
  return {
    category: line.category as LiquidityPositionLineFormValues["category"],
    concept: line.concept,
    amountCop: line.amountCop,
    sortOrder: line.sortOrder,
  };
}
