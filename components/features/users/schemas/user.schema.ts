import { z } from "zod";
import { ROLE_IDS } from "@/config/roles";
import { identityPasswordSchema } from "@/lib/validation/password.schema";

const clientIdField = z.number().positive().nullable().optional();
const commercialRepIdField = z.number().positive().nullable().optional();
const companyAccessIdsField = z.array(z.number().int().positive()).default([]);

function validateRoleSpecificFields(
  data: {
    role: string;
    companyId: number;
    clientId?: number | null;
    companyAccessIds?: number[];
    commercialRepId?: number | null;
  },
  ctx: z.RefinementCtx,
) {
  if (data.role === ROLE_IDS.Client && !data.clientId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Seleccione un cliente para el rol Cliente.",
      path: ["clientId"],
    });
  }

  if (data.role === ROLE_IDS.SuperUser) {
    const accessIds = data.companyAccessIds ?? [];

    if (accessIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccione al menos una empresa con acceso.",
        path: ["companyAccessIds"],
      });
    } else if (!accessIds.includes(data.companyId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La empresa principal debe estar incluida en el acceso.",
        path: ["companyAccessIds"],
      });
    }
  }
}

const baseUserFields = {
  fullName: z.string().min(1, "Nombre requerido").max(200),
  companyId: z.number().positive(),
  role: z.string().min(1, "Rol requerido"),
  clientId: clientIdField,
  commercialRepId: commercialRepIdField,
  companyAccessIds: companyAccessIdsField,
  isActive: z.boolean(),
};

export const userSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: identityPasswordSchema,
    ...baseUserFields,
  })
  .superRefine(validateRoleSpecificFields);

export const editUserSchema = z
  .object(baseUserFields)
  .superRefine(validateRoleSpecificFields);

export type UserFormValues = z.infer<typeof userSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const userDefaultValues: UserFormValues = {
  email: "",
  password: "",
  fullName: "",
  companyId: 1,
  role: ROLE_IDS.Employee,
  clientId: null,
  commercialRepId: null,
  companyAccessIds: [],
  isActive: true,
};

export function userToFormValues(
  user: {
    email?: string;
    fullName: string;
    companyId: number;
    role: string;
    clientId?: number | null;
    commercialRepId?: number | null;
    companyAccessIds?: number[];
    isActive: boolean;
  },
  defaultCompanyId: number,
): EditUserFormValues {
  return {
    fullName: user.fullName,
    companyId: user.companyId ?? defaultCompanyId,
    role: user.role,
    clientId: user.clientId ?? null,
    commercialRepId: user.commercialRepId ?? null,
    companyAccessIds:
      user.companyAccessIds && user.companyAccessIds.length > 0
        ? user.companyAccessIds
        : [user.companyId ?? defaultCompanyId],
    isActive: user.isActive,
  };
}

export function createUserToFormValues(
  defaultCompanyId: number,
): UserFormValues {
  return {
    ...userDefaultValues,
    companyId: defaultCompanyId,
    companyAccessIds: [defaultCompanyId],
  };
}
