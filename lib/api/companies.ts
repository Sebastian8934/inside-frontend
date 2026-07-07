import { axiosGetValidated } from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  companiesListSchema,
  companyContextSchema,
} from "@/lib/validation/company.schema";
import type { CompanyContext, CompanyListItem } from "@/types/company";

export async function fetchAccessibleCompanies(): Promise<CompanyListItem[]> {
  return axiosGetValidated(
    API_ENDPOINTS.companies.list,
    companiesListSchema,
    undefined,
    "Lista de empresas inválida.",
  );
}

export async function fetchCompanyContext(): Promise<CompanyContext> {
  return axiosGetValidated(
    API_ENDPOINTS.companies.context,
    companyContextSchema,
    undefined,
    "Contexto de empresa inválido.",
  );
}
