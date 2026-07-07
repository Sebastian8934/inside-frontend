import { axiosGetValidated } from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { rolesListSchema } from "@/lib/validation/auth.schema";
import type { RoleItem } from "@/types/users";

export async function fetchRoles(): Promise<RoleItem[]> {
  return axiosGetValidated(
    API_ENDPOINTS.roles.list,
    rolesListSchema,
    undefined,
    "Lista de roles inválida.",
  );
}
