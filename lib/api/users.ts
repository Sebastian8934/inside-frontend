import { axiosGet, axiosPatch, axiosPost, axiosPut } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
} from "@/types/users";

export async function fetchUsers() {
  return (await axiosGet<UserDetail[]>(API_ENDPOINTS.users.list)) ?? [];
}

export async function createUser(payload: CreateUserPayload) {
  return axiosPost<UserDetail>(API_ENDPOINTS.users.list, payload);
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  return axiosPut<UserDetail>(API_ENDPOINTS.users.detail(id), payload);
}

export async function deactivateUser(id: string) {
  await axiosPatch<null>(`${API_ENDPOINTS.users.detail(id)}/deactivate`);
}
