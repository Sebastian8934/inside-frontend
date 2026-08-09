import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  moduleSchema,
  modulesListSchema,
  permissionCodesSchema,
  permissionSchema,
  permissionsListSchema,
} from "@/lib/validation/permissions.schema";
import type {
  AppModule,
  AppPermission,
  CreateModulePayload,
  CreatePermissionPayload,
  RolePermissionUpdatePayload,
  UpdateModulePayload,
} from "@/types/permissions";

export async function fetchModules(
  includeInactive = false,
): Promise<AppModule[]> {
  return axiosGetValidated(
    API_ENDPOINTS.modules.list,
    modulesListSchema,
    { params: { includeInactive } },
    "Lista de módulos inválida.",
  );
}

export async function createModule(
  payload: CreateModulePayload,
): Promise<AppModule> {
  return axiosPostValidated(
    API_ENDPOINTS.modules.list,
    moduleSchema,
    payload,
    undefined,
    "Módulo creado con respuesta inválida.",
  );
}

export async function updateModule(
  id: number,
  payload: UpdateModulePayload,
): Promise<AppModule> {
  return axiosPutValidated(
    API_ENDPOINTS.modules.detail(id),
    moduleSchema,
    payload,
    undefined,
    "Módulo actualizado con respuesta inválida.",
  );
}

export async function fetchPermissions(
  moduleId?: number,
): Promise<AppPermission[]> {
  return axiosGetValidated(
    API_ENDPOINTS.permissions.list,
    permissionsListSchema,
    { params: moduleId ? { moduleId } : undefined },
    "Lista de permisos inválida.",
  );
}

export async function createPermission(
  payload: CreatePermissionPayload,
): Promise<AppPermission> {
  return axiosPostValidated(
    API_ENDPOINTS.permissions.list,
    permissionSchema,
    payload,
    undefined,
    "Permiso creado con respuesta inválida.",
  );
}

export async function fetchMyPermissions(): Promise<string[]> {
  return axiosGetValidated(
    API_ENDPOINTS.permissions.me,
    permissionCodesSchema,
    undefined,
    "Permisos del usuario inválidos.",
  );
}

export async function fetchRolePermissions(
  roleId: string,
): Promise<AppPermission[]> {
  return axiosGetValidated(
    API_ENDPOINTS.permissions.role(roleId),
    permissionsListSchema,
    undefined,
    "Permisos del rol inválidos.",
  );
}

export async function setRolePermissions(
  roleId: string,
  payload: RolePermissionUpdatePayload,
): Promise<AppPermission[]> {
  return axiosPutValidated(
    API_ENDPOINTS.permissions.role(roleId),
    permissionsListSchema,
    payload,
    undefined,
    "Permisos del rol actualizados con respuesta inválida.",
  );
}
