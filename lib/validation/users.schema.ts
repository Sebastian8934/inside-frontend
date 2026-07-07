import { z } from "zod";
import { companyId, entityId, nullableNumber } from "@/lib/validation/primitives";

export const userDetailSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  fullName: z.string(),
  companyId,
  companyName: z.string(),
  role: z.string().min(1),
  isActive: z.boolean(),
  clientId: nullableNumber,
  commercialRepId: nullableNumber,
  companyAccessIds: z.array(z.number().int()),
});

export const usersListSchema = z.array(userDetailSchema);
