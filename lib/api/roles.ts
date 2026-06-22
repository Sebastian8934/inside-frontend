import { axiosGet } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RoleItem } from "@/types/users";

export async function fetchRoles() {
  return (await axiosGet<RoleItem[]>(API_ENDPOINTS.roles.list)) ?? [];
}
