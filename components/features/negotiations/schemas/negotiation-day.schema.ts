import { z } from "zod";
import type { DailyNegotiationDetail } from "@/types/negotiations";

export const negotiationDaySchema = z.object({
  spotSeticapRate: z.number().nullable().optional(),
  bollekReference: z.string().nullable().optional(),
  totalCobreCp: z.number().nullable().optional(),
  totalCobreV3: z.number().nullable().optional(),
  totalBitso: z.number().nullable().optional(),
  totalFinity: z.number().nullable().optional(),
  grandTotalCop: z.number().nullable().optional(),
});

export type NegotiationDayFormValues = z.infer<typeof negotiationDaySchema>;

export function negotiationDayToFormValues(
  day: DailyNegotiationDetail,
): NegotiationDayFormValues {
  return {
    spotSeticapRate: day.spotSeticapRate ?? null,
    bollekReference: day.bollekReference ?? "",
    totalCobreCp: day.totalCobreCp ?? null,
    totalCobreV3: day.totalCobreV3 ?? null,
    totalBitso: day.totalBitso ?? null,
    totalFinity: day.totalFinity ?? null,
    grandTotalCop: day.grandTotalCop ?? null,
  };
}
