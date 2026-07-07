import { z } from "zod";
import { parseApiData } from "@/lib/validation/parse-api-data";

export const userInfoSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  fullName: z.string(),
  roles: z.array(z.string()),
});

export const loginResponseSchema = z.object({
  expiresAt: z.string().min(1),
  user: userInfoSchema,
});

export const roleItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
});

export const rolesListSchema = z.array(roleItemSchema);

export type ParsedUserInfo = z.infer<typeof userInfoSchema>;
export type ParsedLoginResponse = z.infer<typeof loginResponseSchema>;
export type ParsedRoleItem = z.infer<typeof roleItemSchema>;

export function parseLoginResponse(data: unknown) {
  return parseApiData(
    loginResponseSchema,
    data,
    "Respuesta de sesión inválida.",
  );
}

export function parseUserInfo(data: unknown) {
  return parseApiData(userInfoSchema, data, "Datos de usuario inválidos.");
}

export function parseRolesList(data: unknown) {
  return parseApiData(rolesListSchema, data, "Lista de roles inválida.");
}
