import { axiosDelete } from "@/lib/axios/client";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  roleItemSchema,
  rolesListSchema,
} from "@/lib/validation/auth.schema";
import type { RoleItem } from "@/types/users";

export type CreateRolePayload = {
  name: string;
  displayName?: string | null;
};

export type UpdateRolePayload = {
  name: string;
};

export async function fetchRoles(): Promise<RoleItem[]> {
  return axiosGetValidated(
    API_ENDPOINTS.roles.list,
    rolesListSchema,
    undefined,
    "Lista de roles inválida.",
  );
}

export async function createRole(
  payload: CreateRolePayload,
): Promise<RoleItem> {
  return axiosPostValidated(
    API_ENDPOINTS.roles.list,
    roleItemSchema,
    payload,
    undefined,
    "Rol creado con respuesta inválida.",
  );
}

export async function updateRole(
  roleId: string,
  payload: UpdateRolePayload,
): Promise<RoleItem> {
  return axiosPutValidated(
    API_ENDPOINTS.roles.detail(roleId),
    roleItemSchema,
    payload,
    undefined,
    "Rol actualizado con respuesta inválida.",
  );
}

export async function deleteRole(roleId: string): Promise<void> {
  await axiosDelete(API_ENDPOINTS.roles.detail(roleId));
}
