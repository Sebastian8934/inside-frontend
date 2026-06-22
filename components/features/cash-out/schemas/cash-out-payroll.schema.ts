import { z } from "zod";
import type { PayrollEntry } from "@/types/cash-out";

export const cashOutPayrollSchema = z.object({
  periodMonth: z.number().min(1).max(12),
  periodYear: z.number().min(2000),
  employeeName: z.string().trim().min(1, "Empleado requerido").max(200),
  jobTitle: z.string().trim().min(1, "Cargo requerido").max(100),
  baseSalaryCop: z.number().positive("Salario base requerido"),
  bonusCop: z.number().min(0),
});

export type CashOutPayrollFormValues = z.infer<typeof cashOutPayrollSchema>;

export function cashOutPayrollDefaultValues(
  periodMonth: number,
  periodYear: number,
): CashOutPayrollFormValues {
  return {
    periodMonth,
    periodYear,
    employeeName: "",
    jobTitle: "",
    baseSalaryCop: 0,
    bonusCop: 0,
  };
}

export function cashOutPayrollToFormValues(
  entry: PayrollEntry,
): CashOutPayrollFormValues {
  return {
    periodMonth: entry.periodMonth,
    periodYear: entry.periodYear,
    employeeName: entry.employeeName,
    jobTitle: entry.jobTitle,
    baseSalaryCop: entry.baseSalaryCop,
    bonusCop: entry.bonusCop,
  };
}
