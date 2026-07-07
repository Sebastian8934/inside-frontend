import { z } from "zod";

export const isoDateString = z.string().min(1);
export const nullableString = z.string().nullable();
export const nullableNumber = z.number().nullable();
export const nullableBoolean = z.boolean().nullable();
export const entityId = z.number().int().positive();
export const companyId = z.number().int().positive();

export const timestampsSchema = {
  createdAt: isoDateString,
  updatedAt: nullableString,
};

export function arrayOf<T extends z.ZodType>(schema: T) {
  return z.array(schema);
}
