import { z } from "zod";
import { ROLE_IDS } from "@/config/roles";
import { identityPasswordSchema } from "@/lib/validation/password.schema";

export const userSchema = z.object({
  email: z.string().email("Email inválido"),
  password: identityPasswordSchema,
  fullName: z.string().min(1, "Nombre requerido").max(200),
  companyId: z.number().positive(),
  role: z.string().min(1, "Rol requerido"),
  isActive: z.boolean(),
});

export const editUserSchema = userSchema.omit({ email: true, password: true });

export type UserFormValues = z.infer<typeof userSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const userDefaultValues: UserFormValues = {
  email: "",
  password: "",
  fullName: "",
  companyId: 1,
  role: ROLE_IDS.Employee,
  isActive: true,
};

export function userToFormValues(
  user: {
    email?: string;
    fullName: string;
    companyId: number;
    role: string;
    isActive: boolean;
  },
  defaultCompanyId: number,
): EditUserFormValues {
  return {
    fullName: user.fullName,
    companyId: user.companyId ?? defaultCompanyId,
    role: user.role,
    isActive: user.isActive,
  };
}

export function createUserToFormValues(
  defaultCompanyId: number,
): UserFormValues {
  return {
    ...userDefaultValues,
    companyId: defaultCompanyId,
  };
}
