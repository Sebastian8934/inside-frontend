import { axiosPatch } from "@/lib/axios";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  userDetailSchema,
  usersListSchema,
} from "@/lib/validation/users.schema";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
} from "@/types/users";

export async function fetchUsers(): Promise<UserDetail[]> {
  return axiosGetValidated(
    API_ENDPOINTS.users.list,
    usersListSchema,
    undefined,
    "Lista de usuarios inválida.",
  );
}

export async function createUser(payload: CreateUserPayload): Promise<UserDetail> {
  return axiosPostValidated(
    API_ENDPOINTS.users.list,
    userDetailSchema,
    payload,
    undefined,
    "Usuario creado con respuesta inválida.",
  );
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<UserDetail> {
  return axiosPutValidated(
    API_ENDPOINTS.users.detail(id),
    userDetailSchema,
    payload,
    undefined,
    "Usuario actualizado con respuesta inválida.",
  );
}

export async function deactivateUser(id: string): Promise<void> {
  await axiosPatch<null>(`${API_ENDPOINTS.users.detail(id)}/deactivate`);
}
