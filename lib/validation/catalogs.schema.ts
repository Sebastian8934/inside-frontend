import { z } from "zod";
import {
  companyId,
  entityId,
  isoDateString,
  nullableNumber,
  nullableString,
  timestampsSchema,
} from "@/lib/validation/primitives";

export const clientSchema = z.object({
  id: entityId,
  companyId,
  code: z.string(),
  correctedName: z.string(),
  isActive: z.boolean(),
});

export const clientDetailSchema = clientSchema.extend(timestampsSchema);

export const clientsListSchema = z.array(clientSchema);

export const walletSchema = z.object({
  id: entityId,
  companyId,
  code: z.string(),
  name: z.string(),
  asset: z.string(),
  network: z.string(),
  walletType: z.string(),
  platformId: nullableNumber,
  isActive: z.boolean(),
});

export const walletDetailSchema = walletSchema.extend({
  address: nullableString,
  usageDescription: nullableString,
  referenceBalanceUsdt: z.number(),
  ...timestampsSchema,
});

export const walletsListSchema = z.array(walletSchema);

export const platformSchema = z.object({
  id: entityId,
  companyId,
  name: z.string(),
  type: z.string(),
  isActive: z.boolean(),
});

export const platformDetailSchema = platformSchema.extend(timestampsSchema);

export const platformsListSchema = z.array(platformSchema);

export const otcCounterpartySchema = z.object({
  id: entityId,
  companyId,
  code: z.string(),
  name: z.string(),
  type: z.string(),
  isActive: z.boolean(),
});

export const otcCounterpartyDetailSchema =
  otcCounterpartySchema.extend(timestampsSchema);

export const otcCounterpartiesListSchema = z.array(otcCounterpartySchema);

export const commercialRepSchema = z.object({
  id: entityId,
  companyId,
  initials: z.string(),
  fullName: z.string(),
  isActive: z.boolean(),
});

export const commercialRepDetailSchema =
  commercialRepSchema.extend(timestampsSchema);

export const commercialRepsListSchema = z.array(commercialRepSchema);
