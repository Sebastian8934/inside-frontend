import { z } from "zod";

export const moduleSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  route: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sortOrder: z.number(),
  parentModuleId: z.number().nullable().optional(),
  isActive: z.boolean(),
});

export const permissionSchema = z.object({
  id: z.number(),
  moduleId: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  action: z.string(),
  isActive: z.boolean(),
  moduleCode: z.string().nullable().optional(),
  moduleName: z.string().nullable().optional(),
});

export const modulesListSchema = z.array(moduleSchema);
export const permissionsListSchema = z.array(permissionSchema);
export const permissionCodesSchema = z.array(z.string());
