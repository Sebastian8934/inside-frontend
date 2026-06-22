import { z } from "zod";

export const otcCounterpartySchema = z.object({
  code: z.string().min(1, "Código requerido"),
  name: z.string().min(1, "Nombre requerido"),
  type: z.string().min(1, "Tipo requerido"),
  isActive: z.boolean().optional(),
});

export type OtcCounterpartyFormValues = z.infer<typeof otcCounterpartySchema>;

export const otcCounterpartyDefaultValues: OtcCounterpartyFormValues = {
  code: "",
  name: "",
  type: "OTC Desk",
  isActive: true,
};

export function otcCounterpartyToFormValues(counterparty: {
  code: string;
  name: string;
  type: string;
  isActive: boolean;
}): OtcCounterpartyFormValues {
  return {
    code: counterparty.code,
    name: counterparty.name,
    type: counterparty.type,
    isActive: counterparty.isActive,
  };
}
