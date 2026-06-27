import { z } from "zod";

export const withdrawalCompanySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  isActive: z.boolean().optional(),
});

export type WithdrawalCompanyFormValues = z.infer<typeof withdrawalCompanySchema>;

export const withdrawalCompanyDefaultValues: WithdrawalCompanyFormValues = {
  name: "",
  isActive: true,
};

export function withdrawalCompanyToFormValues(company: {
  name: string;
  isActive: boolean;
}): WithdrawalCompanyFormValues {
  return {
    name: company.name,
    isActive: company.isActive,
  };
}
