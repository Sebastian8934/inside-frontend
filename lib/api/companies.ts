import { axiosGet } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CompanyContext } from "@/types/company";

export async function fetchCompanyContext(): Promise<CompanyContext> {
  const data = await axiosGet<CompanyContext>(API_ENDPOINTS.companies.context);

  if (!data) {
    throw new Error("No se recibió el contexto de empresa.");
  }

  return data;
}
