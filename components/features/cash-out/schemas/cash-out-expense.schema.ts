import { z } from "zod";
import type { CashOutExpenseListItem } from "@/types/cash-out";

export const cashOutExpenseSchema = z.object({
  expenseDate: z.string().min(1, "Fecha requerida"),
  groupId: z.number().positive("Seleccione un grupo"),
  conceptId: z.number().positive("Seleccione un concepto"),
  paymentAccountId: z.number().positive("Seleccione una cuenta"),
  description: z.string().trim().min(1, "Descripción requerida").max(500),
  amountCop: z.number().positive("Monto requerido"),
  expenseType: z.string().nullable().optional(),
});

export type CashOutExpenseFormValues = z.infer<typeof cashOutExpenseSchema>;

export const cashOutExpenseDefaultValues: CashOutExpenseFormValues = {
  expenseDate: "",
  groupId: 0,
  conceptId: 0,
  paymentAccountId: 0,
  description: "",
  amountCop: 0,
  expenseType: "",
};

export function cashOutExpenseToFormValues(
  expense: CashOutExpenseListItem,
): CashOutExpenseFormValues {
  return {
    expenseDate: expense.expenseDate,
    groupId: expense.groupId,
    conceptId: expense.conceptId,
    paymentAccountId: expense.paymentAccountId,
    description: expense.description,
    amountCop: expense.amountCop,
    expenseType: expense.expenseType ?? "",
  };
}
