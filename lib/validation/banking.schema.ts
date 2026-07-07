import { z } from "zod";
import {
  companyId,
  entityId,
  isoDateString,
  nullableString,
  timestampsSchema,
} from "@/lib/validation/primitives";

export const accountHolderSchema = z.object({
  id: entityId,
  companyId,
  name: z.string(),
  isActive: z.boolean(),
});

export const accountHolderDetailSchema =
  accountHolderSchema.extend(timestampsSchema);

export const accountHoldersListSchema = z.array(accountHolderSchema);

export const bankMovementListItemSchema = z.object({
  id: entityId,
  companyId,
  movementDate: isoDateString,
  amountCop: z.number(),
  concept: z.string(),
  accountHolderId: entityId,
  accountHolderName: z.string(),
  periodMonth: z.number().int(),
  periodYear: z.number().int(),
  createdAt: isoDateString,
});

export const bankMovementDetailSchema = bankMovementListItemSchema.extend({
  createdByUserId: nullableString,
  updatedAt: nullableString,
});

export const bankMovementsListSchema = z.array(bankMovementListItemSchema);

export const accountHolderSummarySchema = z.object({
  companyId,
  accountHolderId: entityId,
  accountHolderName: z.string(),
  periodYear: z.number().int(),
  periodMonth: z.number().int(),
  abonos: z.number(),
  egresos: z.number(),
  disponible: z.number(),
});

export const accountHolderSummaryListSchema = z.array(
  accountHolderSummarySchema,
);
