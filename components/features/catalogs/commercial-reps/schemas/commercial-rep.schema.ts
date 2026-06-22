import { z } from "zod";

export const commercialRepSchema = z.object({
  initials: z.string().min(1, "Iniciales requeridas"),
  fullName: z.string().min(1, "Nombre requerido"),
  isActive: z.boolean().optional(),
});

export type CommercialRepFormValues = z.infer<typeof commercialRepSchema>;

export const commercialRepDefaultValues: CommercialRepFormValues = {
  initials: "",
  fullName: "",
  isActive: true,
};

export function commercialRepToFormValues(rep: {
  initials: string;
  fullName: string;
  isActive: boolean;
}): CommercialRepFormValues {
  return {
    initials: rep.initials,
    fullName: rep.fullName,
    isActive: rep.isActive,
  };
}
