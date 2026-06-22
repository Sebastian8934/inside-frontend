import { z } from "zod";
import type { NegotiationRateScenario } from "@/types/negotiations";

export const negotiationScenarioSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido"),
  costPercent: z.string().nullable().optional(),
  spread: z.number().nullable().optional(),
  cobreRate: z.number().nullable().optional(),
  closingRate: z.number().nullable().optional(),
  sortOrder: z.number(),
});

export type NegotiationScenarioFormValues = z.infer<
  typeof negotiationScenarioSchema
>;

export function negotiationScenarioDefaultValues(
  nextSortOrder: number,
): NegotiationScenarioFormValues {
  return {
    name: "",
    costPercent: "",
    spread: null,
    cobreRate: null,
    closingRate: null,
    sortOrder: nextSortOrder,
  };
}

export function negotiationScenarioToFormValues(
  scenario: NegotiationRateScenario,
): NegotiationScenarioFormValues {
  return {
    name: scenario.name,
    costPercent: scenario.costPercent ?? "",
    spread: scenario.spread ?? null,
    cobreRate: scenario.cobreRate ?? null,
    closingRate: scenario.closingRate ?? null,
    sortOrder: scenario.sortOrder,
  };
}
