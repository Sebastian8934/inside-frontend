import { axiosDelete, axiosPost } from "@/lib/axios/client";
import {
  axiosGetValidated,
  axiosPostValidated,
  axiosPutValidated,
} from "@/lib/axios/validated";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  companiesListSchema,
  companyContextSchema,
  companyListItemSchema,
} from "@/lib/validation/company.schema";
import type { CompanyContext, CompanyListItem } from "@/types/company";

export type CreateCompanyPayload = {
  name: string;
  taxId?: string | null;
  isActive?: boolean;
};

export type UpdateCompanyPayload = {
  name?: string;
  taxId?: string | null;
  isActive?: boolean;
};

export async function fetchAccessibleCompanies(
  includeInactive = false,
): Promise<CompanyListItem[]> {
  return axiosGetValidated(
    API_ENDPOINTS.companies.list,
    companiesListSchema,
    { params: { includeInactive } },
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

export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<CompanyListItem> {
  return axiosPostValidated(
    API_ENDPOINTS.companies.list,
    companyListItemSchema,
    payload,
    undefined,
    "Empresa creada con respuesta inválida.",
  );
}

export async function updateCompany(
  id: number,
  payload: UpdateCompanyPayload,
): Promise<CompanyListItem> {
  return axiosPutValidated(
    API_ENDPOINTS.companies.detail(id),
    companyListItemSchema,
    payload,
    undefined,
    "Empresa actualizada con respuesta inválida.",
  );
}

export async function activateCompany(id: number): Promise<void> {
  await axiosPost(API_ENDPOINTS.companies.activate(id));
}

export async function deactivateCompany(id: number): Promise<void> {
  await axiosPost(API_ENDPOINTS.companies.deactivate(id));
}

export async function deleteCompany(id: number): Promise<void> {
  await axiosDelete(API_ENDPOINTS.companies.detail(id));
}
