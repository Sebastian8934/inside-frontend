import { z } from "zod";

export const bankMovementSchema = z.object({
  movementDate: z.string().min(1, "La fecha es requerida"),
  accountHolderId: z.number().positive("Seleccione un titular"),
  concept: z.string().trim().min(1, "El concepto es requerido").max(200),
  amountCop: z
    .number({ error: "Monto requerido" })
    .refine((v) => v !== 0, "Monto no puede ser 0"),
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int().min(2000).max(2100),
});

export type BankMovementFormValues = z.infer<typeof bankMovementSchema>;

export const accountHolderSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(200),
  isActive: z.boolean(),
});

export type AccountHolderFormValues = z.infer<typeof accountHolderSchema>;

export const accountHolderDefaultValues: AccountHolderFormValues = {
  name: "",
  isActive: true,
};

export function bankMovementToFormValues(
  movement: {
    movementDate: string;
    accountHolderId: number;
    concept: string;
    amountCop: number;
    periodMonth: number;
    periodYear: number;
  },
  defaultDate: string,
  defaultPeriod: { periodMonth: number; periodYear: number },
): BankMovementFormValues {
  return {
    movementDate: movement.movementDate ?? defaultDate,
    accountHolderId: movement.accountHolderId,
    concept: movement.concept,
    amountCop: movement.amountCop,
    periodMonth: movement.periodMonth ?? defaultPeriod.periodMonth,
    periodYear: movement.periodYear ?? defaultPeriod.periodYear,
  };
}

export function accountHolderToFormValues(holder: {
  name: string;
  isActive: boolean;
}): AccountHolderFormValues {
  return {
    name: holder.name,
    isActive: holder.isActive,
  };
}
