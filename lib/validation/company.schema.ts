import { z } from "zod";
import { parseApiData } from "@/lib/validation/parse-api-data";

export const companyListItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  taxId: z.string().nullable(),
  isActive: z.boolean(),
  canDelete: z.boolean().optional().default(false),
});

export const companiesListSchema = z.array(companyListItemSchema);

export const companyContextSchema = z.object({
  userId: z.string().min(1),
  role: z.string().min(1),
  defaultCompanyId: z.number().int().positive(),
  activeCompanyId: z.number().int().positive().nullable(),
  accessibleCompanies: z.array(companyListItemSchema),
});

export type ParsedCompanyContext = z.infer<typeof companyContextSchema>;

export function parseCompanyContext(data: unknown) {
  return parseApiData(
    companyContextSchema,
    data,
    "Contexto de empresa inválido.",
  );
}
