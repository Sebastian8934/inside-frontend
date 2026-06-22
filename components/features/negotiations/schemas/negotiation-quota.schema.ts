import { z } from "zod";
import { NEGOTIATION_QUOTA_STATUSES } from "@/types/negotiations";
import type { NegotiationDailyQuota } from "@/types/negotiations";

export const negotiationQuotaSchema = z.object({
  commercialRepId: z.number().positive("Seleccione un comercial").optional(),
  otcCounterpartyId: z.number().positive("Seleccione una contraparte").optional(),
  quotaAmount: z.number().positive("Cupo requerido"),
  maxDailyAmount: z.number().positive("Máximo diario requerido"),
  differenceAmount: z.number(),
  status: z.enum(NEGOTIATION_QUOTA_STATUSES),
});

export type NegotiationQuotaFormValues = z.infer<typeof negotiationQuotaSchema>;

export const negotiationQuotaDefaultValues: NegotiationQuotaFormValues = {
  commercialRepId: undefined,
  otcCounterpartyId: undefined,
  quotaAmount: 0,
  maxDailyAmount: 0,
  differenceAmount: 0,
  status: NEGOTIATION_QUOTA_STATUSES[0],
};

export function negotiationQuotaToFormValues(
  quota: NegotiationDailyQuota,
): NegotiationQuotaFormValues {
  return {
    commercialRepId: quota.commercialRepId,
    otcCounterpartyId: quota.otcCounterpartyId,
    quotaAmount: quota.quotaAmount,
    maxDailyAmount: quota.maxDailyAmount,
    differenceAmount: quota.differenceAmount,
    status: quota.status as NegotiationQuotaFormValues["status"],
  };
}
