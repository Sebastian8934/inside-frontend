import { z } from "zod";

export const cashOutGroupSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  isActive: z.boolean().optional(),
});

export type CashOutGroupFormValues = z.infer<typeof cashOutGroupSchema>;

export const cashOutGroupDefaultValues: CashOutGroupFormValues = {
  name: "",
  isActive: true,
};

export function cashOutGroupToFormValues(group: {
  name: string;
  isActive: boolean;
}): CashOutGroupFormValues {
  return {
    name: group.name,
    isActive: group.isActive,
  };
}

export const cashOutConceptSchema = z.object({
  groupId: z.number().positive("Seleccione un grupo"),
  name: z.string().min(1, "Nombre requerido"),
  isActive: z.boolean().optional(),
});

export type CashOutConceptFormValues = z.infer<typeof cashOutConceptSchema>;

export const cashOutConceptDefaultValues: CashOutConceptFormValues = {
  groupId: 0,
  name: "",
  isActive: true,
};

export function cashOutConceptToFormValues(concept: {
  groupId: number;
  name: string;
  isActive: boolean;
}): CashOutConceptFormValues {
  return {
    groupId: concept.groupId,
    name: concept.name,
    isActive: concept.isActive,
  };
}

export const paymentAccountSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  isActive: z.boolean().optional(),
});

export type PaymentAccountFormValues = z.infer<typeof paymentAccountSchema>;

export const paymentAccountDefaultValues: PaymentAccountFormValues = {
  name: "",
  isActive: true,
};

export function paymentAccountToFormValues(account: {
  name: string;
  isActive: boolean;
}): PaymentAccountFormValues {
  return {
    name: account.name,
    isActive: account.isActive,
  };
}
