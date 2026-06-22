import { z } from "zod";
import {
  NEGOTIATION_LINE_STATUSES,
  NEGOTIATION_SIDES,
} from "@/types/negotiations";
import type { NegotiationLine } from "@/types/negotiations";

export const negotiationLineSchema = z.object({
  lineNumber: z.number().positive("Número de línea requerido"),
  platformId: z.number().nullable().optional(),
  side: z.enum(NEGOTIATION_SIDES).nullable().optional(),
  otcCounterpartyId: z.number().nullable().optional(),
  commercialRepId: z.number().nullable().optional(),
  orderer: z.string().nullable().optional(),
  quantityUsdt: z.number().nullable().optional(),
  spotRate: z.string().nullable().optional(),
  netRate: z.string().nullable().optional(),
  subtotalCop: z.number().nullable().optional(),
  totalCop: z.number().nullable().optional(),
  externalNegotiationId: z.string().nullable().optional(),
  loadReference: z.string().nullable().optional(),
  status: z.enum(NEGOTIATION_LINE_STATUSES),
});

export type NegotiationLineFormValues = z.infer<typeof negotiationLineSchema>;

export function negotiationLineDefaultValues(
  nextLineNumber: number,
): NegotiationLineFormValues {
  return {
    lineNumber: nextLineNumber,
    platformId: null,
    side: null,
    otcCounterpartyId: null,
    commercialRepId: null,
    orderer: "",
    quantityUsdt: null,
    spotRate: "",
    netRate: "",
    subtotalCop: null,
    totalCop: null,
    externalNegotiationId: "",
    loadReference: "",
    status: NEGOTIATION_LINE_STATUSES[0],
  };
}

export function negotiationLineToFormValues(
  line: NegotiationLine,
): NegotiationLineFormValues {
  return {
    lineNumber: line.lineNumber,
    platformId: line.platformId ?? null,
    side: (line.side as NegotiationLineFormValues["side"]) ?? null,
    otcCounterpartyId: line.otcCounterpartyId ?? null,
    commercialRepId: line.commercialRepId ?? null,
    orderer: line.orderer ?? "",
    quantityUsdt: line.quantityUsdt ?? null,
    spotRate: line.spotRate ?? "",
    netRate: line.netRate ?? "",
    subtotalCop: line.subtotalCop ?? null,
    totalCop: line.totalCop ?? null,
    externalNegotiationId: line.externalNegotiationId ?? "",
    loadReference: line.loadReference ?? "",
    status: line.status as NegotiationLineFormValues["status"],
  };
}
