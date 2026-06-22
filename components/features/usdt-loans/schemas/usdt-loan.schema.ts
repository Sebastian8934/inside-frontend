import { z } from "zod";

export const usdtLoanSchema = z.object({
  clientId: z.number().positive("Seleccione un cliente").optional(),
  lentUsdt: z.number({ error: "USDT prestado requerido" }).min(0),
  returnedUsdt: z.number({ error: "USDT devuelto requerido" }).min(0),
  averageRate: z.number().min(0).nullable().optional(),
});

export const createUsdtLoanSchema = usdtLoanSchema.extend({
  clientId: z.number().positive("Seleccione un cliente"),
});

export type UsdtLoanFormValues = z.infer<typeof usdtLoanSchema>;
export type CreateUsdtLoanFormValues = z.infer<typeof createUsdtLoanSchema>;

export const usdtLoanDefaultValues: CreateUsdtLoanFormValues = {
  clientId: 0,
  lentUsdt: 0,
  returnedUsdt: 0,
  averageRate: null,
};

export function usdtLoanToFormValues(loan: {
  clientId: number;
  lentUsdt: number;
  returnedUsdt: number;
  averageRate?: number | null;
}): UsdtLoanFormValues {
  return {
    clientId: loan.clientId,
    lentUsdt: loan.lentUsdt,
    returnedUsdt: loan.returnedUsdt,
    averageRate: loan.averageRate ?? null,
  };
}
